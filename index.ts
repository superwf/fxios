/// <reference path="typings/index.d.ts" />
import * as URL from 'url'
import * as pathToRegexp from 'path-to-regexp'
import * as EventEmitter from 'events'

// copy from lodash
export function isPlainObject(value: any): boolean {
  if (value === undefined || value === null) {
    return false
  }
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

export const parseUrl = (url: Url, query?: Query): string => {
  if (typeof url === 'object') {
    url = pathToRegexp.compile(url.url)(url.param)
  }
  if (query) {
    const urlObject = URL.parse(url, true) // true: let the urlObject.query is object
    // see url#format, only search is absent, query will be used
    delete urlObject.search
    return URL.format({
      ...urlObject,
      query: {
        ...urlObject.query,
        ...query,
      },
    })
  }
  return url
}

export class Fxios extends EventEmitter {
  base: string
  interceptor: Interceptor = {
    request: [],
    response: [],
    catch: [],
  }

  config: RequestInit
  get: RequestWithoutBody
  head: RequestWithoutBody
  post: RequestWithBody
  put: RequestWithBody
  delete: RequestWithBody
  patch: RequestWithBody

  constructor(config: FxiosConfig = defaultRequestConfig) {
    super()
    const { base, ...requestConfig } = config
    this.config = { ...defaultRequestConfig, ...requestConfig }
    this.base = base || ''
    // default max is 10
    // https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
    // 1000 should be enough
    this.setMaxListeners(1000)

    this.get = (
      url: Url,
      query?: Query,
      runtimeConfig?: RequestInit,
    ): Promise<any> => this.request('get', url, undefined, query, runtimeConfig)

    this.head = (
      url: Url,
      query?: Query,
      runtimeConfig?: RequestInit,
    ): Promise<any> =>
      this.request('head', url, undefined, query, runtimeConfig)

    this.post = (
      url: Url,
      body?: any,
      query?: Query,
      runtimeConfig?: RequestInit,
    ): Promise<any> => this.request('post', url, body, query, runtimeConfig)

    this.put = (
      url: Url,
      body?: any,
      query?: Query,
      runtimeConfig?: RequestInit,
    ): Promise<any> => this.request('put', url, body, query, runtimeConfig)
    this.patch = (
      url: Url,
      body?: any,
      query?: Query,
      runtimeConfig?: RequestInit,
    ): Promise<any> => this.request('patch', url, body, query, runtimeConfig)
    this.delete = (
      url: Url,
      body?: any,
      query?: Query,
      runtimeConfig?: RequestInit,
    ): Promise<any> => this.request('delete', url, body, query, runtimeConfig)
  }

  request(
    method: string,
    url: Url,
    body?: any,
    query?: Query,
    runtimeConfig: RequestInit = {},
  ): Promise<any> {
    const parsedUrl = parseUrl(url, query)
    const { base } = this
    const request: RequestInit = {
      ...this.config,
      method,
      ...runtimeConfig,
    }
    let headers: HeadersInit = request.headers || {}
    if (isPlainObject(body)) {
      request.headers = {
        'content-type': jsonType,
        ...headers,
      }
      body = JSON.stringify(body)
    }
    request.body = body
    let req: Request = new Request(`${base}${parsedUrl}`, request)
    this.interceptor.request.forEach(cb => {
      req = cb(req)
    })
    let promise = fetch(req)

    this.interceptor.response.forEach(cb => {
      promise = promise.then(res => cb(res, req))
    })

    this.interceptor.catch.forEach(cb => {
      promise = promise.catch(err => cb(err, req))
    })
    return promise
  }

  // options(url: Url, query?: Query, runtimeConfig?: RequestInit): Promise<any> {
  //   return this.request('options', url, undefined, query, runtimeConfig)
  // }

  // trace(url: Url, query?: Query, runtimeConfig?: RequestInit): Promise<any> {
  //   return this.request('trace', url, undefined, query, runtimeConfig)
  // }
}
