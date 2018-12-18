/// <reference path="typings/index.d.ts" />
import * as URL from 'url'
import * as pathToRegexp from 'path-to-regexp'

// copy from lodash
export function isPlainObject(value: any): boolean {
  if (Object.getPrototypeOf(value) === null || Array.isArray(value)) {
    return true
  }
  if (
    typeof value !== 'object' ||
    value === null ||
    String(value) !== '[object Object]'
  ) {
    return false
  }
  let proto = Object.getPrototypeOf(value)
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(value) === proto
}

export const defaultRequestConfig: RequestInit = {
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
}

export const jsonType: string = 'application/json'

export const parseUrl = (url: string, option?: FxiosRequestOption): string => {
  if (option && option.param) {
    url = pathToRegexp.compile(url)(option.param)
  }
  if (option && option.query) {
    const urlObject = URL.parse(url, true) // true: let the urlObject.query is object
    // see url#format, only search is absent, query will be used
    delete urlObject.search
    url = URL.format({
      ...urlObject,
      query: {
        ...urlObject.query,
        ...option.query,
      },
    })
  }
  return url
}

export class Fxios {
  baseURL: string
  interceptor: Interceptor = {
    request: [],
    response: [],
    catch: [],
  }

  fetchConfig: RequestInit
  get: RequestFunction
  post: RequestFunction
  put: RequestFunction
  delete: RequestFunction
  patch: RequestFunction

  // for extendHttpMethod
  [key: string]: any

  constructor(config: FxiosConfig = defaultRequestConfig) {
    const { baseURL, ...requestConfig } = config
    this.fetchConfig = { ...requestConfig }
    this.baseURL = baseURL || ''

    const methods: Array<HttpMethod> = [
      'get',
      'post',
      'put',
      'delete',
      'patch',
    ]
    methods.forEach((method: HttpMethod) => {
      this[method] = (
        url: string,
        option?: FxiosRequestOption,
        runtimeConfig?: RequestInit,
      ): Promise<any> => this.request(method, url, option, runtimeConfig)
    })
  }

  extendHttpMethod(method: string): void {
    this[method] = (
        url: string,
        option?: FxiosRequestOption,
        runtimeConfig?: RequestInit,
      ): Promise<any> => this.request(method, url, option, runtimeConfig)
  }

  async request(
    method: string,
    url: string,
    option?: FxiosRequestOption,
    runtimeConfig?: FxiosConfig,
  ): Promise<any> {
    for (const cb of this.interceptor.request) {
      [url, option, runtimeConfig] = await cb.call(this, url, option, runtimeConfig)
    }
    const parsedUrl = parseUrl(url, option)
    if (runtimeConfig === undefined) {
      runtimeConfig = {}
    }
    const baseURL = 'baseURL' in runtimeConfig ? runtimeConfig.baseURL : this.baseURL
    const requestOption: FxiosConfig = {
      ...this.fetchConfig,
      method,
      ...runtimeConfig,
    }
    let headers: HeadersInit = requestOption.headers || {}
    if (option && option.body) {
      let { body } = option
      if (isPlainObject(body)) {
        requestOption.headers = {
          'Content-Type': jsonType,
          ...headers,
        }
        body = JSON.stringify(body)
      }
      requestOption.body = body
    }
    const req: Request = new Request(`${baseURL}${parsedUrl}`, requestOption)
    let promise = fetch(req)

    this.interceptor.response.forEach(cb => {
      promise = promise.then(res => cb.call(this, res, req))
    })

    this.interceptor.catch.forEach(cb => {
      promise = promise.catch(err => cb.call(this, err, req))
    })
    return promise
  }
}
