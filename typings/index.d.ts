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
