// 混合的合成参数
interface Option {
  query?: Query
  param?: Param
  body?: any
}

// url query 对象
interface Query {
  [index: string]: string
}

// 路由参数对象
interface Param {
  [index: string]: string
}

// 实例化的配置参数
interface FxiosConfig extends RequestInit {
  base?: string
}

// 实例化的配置参数
type ResponseCallback = (res: any, req: Request) => any
type RequestCallback = (res: Request) => Request
type CatchCallback = (err: Error, req: Request) => any

// 拦截器
interface Interceptor {
  request: RequestCallback[]
  response: ResponseCallback[]
  catch: CatchCallback[]
}

// get, head method
type RequestWithoutBody = (
  url: string,
  query?: Query,
  runtimeConfig?: RequestInit,
) => Promise<any>
// post put delete patch method
type RequestWithBody = (
  url: string,
  body?: any,
  query?: Query,
  runtimeConfig?: RequestInit,
) => Promise<any>
