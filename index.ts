import deepAssign = require('deep-assign')
import * as pathToRegexp from 'path-to-regexp'
import * as URL from 'url'

/** all supported http method */
export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'head'
  | 'options'

// url query 对象
export interface IQuery {
  [index: string]:
    | string
    | string[]
    | number
    | number[]
    | boolean
    | boolean[]
    | undefined
}

// 路由参数对象
export interface IPath {
  [index: string]: string | number | boolean | undefined
}

// 发起请求时的通用参数
export interface IFxiosRequestOption extends RequestInit {
  query?: IQuery
  body?: any
  path?: IPath
  formData?: any
  baseURL?: string
  url: string
}

export type FxiosRequestOption = IFxiosRequestOption | string

// 实例化的配置参数
export interface IFxiosConfig extends RequestInit {
  baseURL?: string
}

// 实例化的配置参数
export type ResponseInterceptor = (res: any, req: Request) => any

export type RequestInterceptor = (
  option?: FxiosRequestOption,
) => FxiosRequestOption

export type CatchInterceptor = (err: Error, req: Request) => any | never

// 拦截器
export interface IInterceptor {
  request?: RequestInterceptor
  response?: ResponseInterceptor
  catch?: CatchInterceptor
}

export type RequestFunction = <T = Response>(
  option?: FxiosRequestOption,
) => Promise<T>

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

const removeNonRequestInitProperty = (
  option: IFxiosRequestOption,
): RequestInit => {
  const { query, body, path, baseURL, url, formData, ...requestInit } = option
  return requestInit
}

// export const defaultRequestConfig: Omit<IFxiosRequestOption, 'url'> = {
//   credentials: 'include',
//   redirect: 'manual',
//   mode: 'cors',
//   cache: 'reload',
//   method: 'get',
//   baseURL: '',
// }

export const jsonType: string = 'application/json'

export const parseUrl = (url: string, option?: IFxiosRequestOption): string => {
  if (option && option.path) {
    for (const k of Object.keys(option.path)) {
      option.path[k] = encodeURIComponent(String(option.path[k]))
    }
    url = pathToRegexp.compile(url)(option.path)
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
  /** factory method
   * follow axios create method */
  public static create(config?: IFxiosConfig) {
    return new Fxios(config)
  }

  public interceptor: IInterceptor = {}
  public baseURL: string = ''

  // support what axios support
  public get: RequestFunction
  public post: RequestFunction
  public put: RequestFunction
  public delete: RequestFunction
  public patch: RequestFunction
  public head: RequestFunction
  public options: RequestFunction

  // instance factory method
  public create = Fxios.create

  public requestOption: RequestInit

  constructor(config?: IFxiosConfig) {
    if (config) {
      const { baseURL, ...requestInit } = config
      this.baseURL = config.baseURL || ''
      this.requestOption = requestInit
    }

    const methods: HttpMethod[] = [
      'get',
      'post',
      'put',
      'delete',
      'patch',
      'head',
      'options',
    ]

    return new Proxy(this, {
      get(target: Fxios, key: HttpMethod, receiver) {
        // console.log(target, key, receiver)
        if (key in target) {
          return Reflect.get(target, key, receiver)
        }
        if (methods.includes(key)) {
          const method = (option: FxiosRequestOption) => {
            if (!option) {
              option = { url: '', method: 'get' }
            }
            if (typeof option === 'string') {
              option = {
                method: key,
                url: option,
              }
            } else {
              option.method = key
            }
            return target.request(option)
          }
          Reflect.set(target, key, method)
          return method
        }
      },
    })
  }

  public async request(option: FxiosRequestOption) {
    if (this.interceptor.request) {
      option = this.interceptor.request(option)
    }
    if (typeof option === 'string') {
      option = {
        method: 'get',
        url: option,
      }
    }
    option.method = option.method || 'get'
    const baseURL = option.baseURL || this.baseURL
    const url = baseURL ? `${baseURL}${option.url}` : option.url
    const parsedUrl = parseUrl(url, option)
    const requestOption: RequestInit = removeNonRequestInitProperty(option)
    const headers: HeadersInit = requestOption.headers || {}
    if (option.body) {
      let { body } = option
      // add application/json header when body is plain object
      // and auto json stringify the body
      if (isPlainObject(body)) {
        requestOption.headers = {
          'Content-Type': jsonType,
          ...headers,
        }
        body = JSON.stringify(body)
      }
      requestOption.body = body
    }
    // when upload file
    if (option.formData) {
      const { formData } = option
      if (formData instanceof FormData) {
        requestOption.body = formData
      }
      if (isPlainObject(formData)) {
        const form = new FormData()
        Object.keys(formData).forEach(k => {
          if (formData.hasOwnProperty(k)) {
            form.append(k, formData[k])
          }
        })
        requestOption.body = form
      }
    }

    const req = deepAssign({}, this.requestOption, requestOption)
    return fetch(parsedUrl, req)
      .then(res => {
        if (this.interceptor.response !== undefined) {
          return this.interceptor.response.call(this, res, req)
        }
        return res
      })
      .catch((err: any) => {
        if (this.interceptor.catch !== undefined) {
          return this.interceptor.catch.call(this, err, req)
        }
        throw err
      })
  }
}

export default new Fxios()
