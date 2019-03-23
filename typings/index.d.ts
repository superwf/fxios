import { UrlWithParsedQuery } from 'url'

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
// export type ResponseCallback = <T>(res: any, req: Request) => Promise<T>

export interface ResponseCallback {
  <T>(res: any, req: Request): T | void
  call: <T>(v: any, res: any, req: Request) => T | void
}

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

export type RequestFunction = (
  url: string,
  option?: FxiosRequestOption,
  runtimeConfig?: FxiosConfig,
) => Promise<any>

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'
