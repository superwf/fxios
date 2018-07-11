import * as URL from 'url'
import * as pathToRegexp from 'path-to-regexp'
import * as EventEmitter from 'events'

// copy from lodash
export function isPlainObject(value: any): boolean {
  if (value === undefined || value === null) {
    return false
  }
  if (Object.getPrototypeOf(value) === null) {
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

export class Fxios {
  config: FxiosConfig
  base: string
  interceptor: Interceptor = {
    request: [],
    response: [],
  }
  on: (event: string, listener: (data?: any) => void) => EventEmitter
  off: (event: string, listener: (data?: any) => void) => EventEmitter
  emit: (event: string) => boolean
  emitter: EventEmitter

  requestConfig: RequestInit

  constructor(config: FxiosConfig = defaultRequestConfig) {
    const { base, ...requestConfig } = config
    this.requestConfig = { ...defaultRequestConfig, ...requestConfig }
    this.base = base || ''
    const emitter = new EventEmitter()
    // default max is 10
    // https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
    // 1000 should be enough
    emitter.setMaxListeners(1000)
    this.on = emitter.on.bind(emitter)
    this.off = emitter.removeListener.bind(emitter)
    this.emit = emitter.emit.bind(emitter)
    this.emitter = emitter
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
      ...this.requestConfig,
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
    // console.log(request, req)
    this.interceptor.request.forEach(cb => {
      req = cb(req)
    })
    let promise = fetch(req)

    this.interceptor.response.forEach(cb => {
      promise = promise.then(res => cb(res, request))
    })
    return promise
  }

  get(url: Url, query?: Query, runtimeConfig?: RequestInit): Promise<any> {
    return this.request('get', url, undefined, query, runtimeConfig)
  }

  post(
    url: Url,
    body?: any,
    query?: Query,
    runtimeConfig?: RequestInit,
  ): Promise<any> {
    return this.request('post', url, body, query, runtimeConfig)
  }

  delete(
    url: Url,
    body?: any,
    query?: Query,
    runtimeConfig?: RequestInit,
  ): Promise<any> {
    return this.request('delete', url, body, query, runtimeConfig)
  }

  put(
    url: Url,
    body?: any,
    query?: Query,
    runtimeConfig?: RequestInit,
  ): Promise<any> {
    return this.request('put', url, body, query, runtimeConfig)
  }
}
