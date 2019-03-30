import * as URL from 'url'
import * as pathToRegexp from 'path-to-regexp'

// url query 对象
export interface Query {
  [index: string]: string | string[]
}

// 路由参数对象
export interface Param {
  [index: string]: string
}

// 发起请求时的通用参数
export interface FxiosRequestOption {
  query?: Query
  param?: Param
  body?: any
}

// 实例化的配置参数
export interface FxiosConfig extends RequestInit {
  baseURL?: string
}

// 实例化的配置参数
export type ResponseCallback = (res: any, req: Request) => any

// export interface ResponseCallback {
//   <T>(res: any, req: Request): Promise<T> | T
//   call: <T>(v: any, res: any, req: Request) => Promise<T> | T
// }

export type RequestCallback = (
  url: string,
  option?: FxiosRequestOption,
  runtimeConfig?: FxiosConfig,
) => [string, FxiosRequestOption | undefined, FxiosConfig | undefined]
export type CatchCallback = (err: Error, req: Request) => any | never

// 拦截器
export interface Interceptor {
  request?: RequestCallback
  response?: ResponseCallback
  catch?: CatchCallback
}

export type RequestFunction = <T = Response>(
  url: string,
  option?: FxiosRequestOption,
  runtimeConfig?: FxiosConfig,
) => Promise<T>

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

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
    for (let k of Object.keys(option.param)) {
      option.param[k] = encodeURIComponent(option.param[k])
    }
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
  interceptor: Interceptor = {}

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

    const methods: Array<HttpMethod> = ['get', 'post', 'put', 'delete', 'patch']
    methods.forEach((method: HttpMethod) => {
      this[method] = <T = Response>(
        url: string,
        option?: FxiosRequestOption,
        runtimeConfig?: RequestInit,
      ): Promise<T> => this.request<T>(method, url, option, runtimeConfig)
    })
  }

  extendHttpMethod(method: string): void {
    this[method] = <T>(
      url: string,
      option?: FxiosRequestOption,
      runtimeConfig?: RequestInit,
    ): Promise<T> => this.request<T>(method, url, option, runtimeConfig)
  }

  async request<T = Response>(
    method: string,
    url: string,
    option?: FxiosRequestOption,
    runtimeConfig?: FxiosConfig,
  ) {
    method = method.toUpperCase()
    if (runtimeConfig === undefined) {
      runtimeConfig = {
        method,
      }
    } else {
      runtimeConfig.method = method
    }
    if (this.interceptor.request) {
      ;[url, option, runtimeConfig] = await this.interceptor.request.call(
        this,
        url,
        option,
        runtimeConfig,
      )
    }
    const parsedUrl = parseUrl(url, option)
    const baseURL =
      runtimeConfig && 'baseURL' in runtimeConfig
        ? runtimeConfig.baseURL
        : this.baseURL
    const requestOption: FxiosConfig = {
      ...this.fetchConfig,
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
    return fetch(req)
      .then<T>(res => {
        if (this.interceptor.response !== undefined) {
          return this.interceptor.response.call(this, res, req)
        }
        return (res as unknown) as T
      })
      .catch((err: any) => {
        if (this.interceptor.catch !== undefined) {
          return this.interceptor.catch.call(this, err, req)
        }
        throw err
      })
  }

  create(config: FxiosConfig = defaultRequestConfig) {
    return new Fxios(config)
  }
}
