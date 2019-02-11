// 发起请求时的通用参数
export interface FxiosRequestOption {
  query?: Query
  param?: Param
  body?: any
}

// url query 对象
export interface Query {
  [index: string]: string
}

// 路由参数对象
export interface Param {
  [index: string]: string
}

// 实例化的配置参数
export interface FxiosConfig extends RequestInit {
  baseURL?: string
}

// 实例化的配置参数
export type ResponseCallback = (res: any, req: Request) => any
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
  runtimeConfig?: RequestInit,
) => Promise<any>

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'
