import * as URL from 'url'
import * as pathToRegexp from 'path-to-regexp'
import * as EventEmitter from 'events'
import isPlainObject = require('lodash/isPlainObject')
// import merge = require('lodash/merge')

export const defaultConfig: RequestInit = {
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
}

export const jsonType: string = 'application/json'

interface UrlParam {
  url: string
  param: string
}

interface Query {
  [index: string]: string
}

export const parseUrl = (url: string | UrlParam, query?: Query): string => {
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

interface FxiosConfig {
  base?: string
  request?: RequestInit
}

type ResponseCallback = (res: Response, req: RequestInit) => any
type RequestCallback = (res: Request) => any

interface Interceptor {
  request: RequestCallback[]
  response: ResponseCallback[]
}

class Fxios {
  config: FxiosConfig
  interceptor: Interceptor = {
    request: [],
    response: [],
  }
  on: (event: string, listener: (data?: any) => void) => EventEmitter
  off: (event: string, listener: (data?: any) => void) => EventEmitter
  emit: (event: string) => boolean
  emitter: EventEmitter

  requestConfig: RequestInit

  constructor(config: FxiosConfig = { base: '', request: defaultConfig }) {
    this.requestConfig = config.request || defaultConfig
    this.config = config
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
    url: string | UrlParam,
    body?: any,
    query?: Query,
    runtimeConfig: RequestInit = {},
  ): Promise<any> {
    const parsedUrl = parseUrl(url, query)
    const base = this.config.base
    const request: RequestInit = {
      ...this.requestConfig,
      method,
      ...runtimeConfig,
    }
    let headers: HeadersInit = request.headers || {}
    if (isPlainObject(body)) {
      headers = {
        'Content-Type': jsonType,
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
      promise = promise.then(res => cb(res, request))
    })
    return promise
  }

  get(
    url: string | UrlParam,
    query?: Query,
    runtimeConfig: RequestInit = {},
  ): Promise<any> {
    return this.request('get', url, undefined, query, runtimeConfig)
  }

  post(
    url: string | UrlParam,
    body?: any,
    query?: Query,
    runtimeConfig: RequestInit = {},
  ): Promise<any> {
    return this.request('post', url, body, query, runtimeConfig)
  }

  delete(
    url: string | UrlParam,
    body?: any,
    query?: Query,
    runtimeConfig: RequestInit = {},
  ): Promise<any> {
    return this.request('delete', url, body, query, runtimeConfig)
  }

  put(
    url: string | UrlParam,
    body?: any,
    query?: Query,
    runtimeConfig: RequestInit = {},
  ): Promise<any> {
    return this.request('delete', url, body, query, runtimeConfig)
  }
}

export default Fxios
