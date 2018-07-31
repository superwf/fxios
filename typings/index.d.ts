// 作为路由参数的url
interface UrlWithRouterParam {
  url: string
  param?: string
}

type Url = string | UrlWithRouterParam

// url query 对象
interface Query {
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
  url: Url,
  query?: Query,
  runtimeConfig?: RequestInit,
) => Promise<any>
// post put delete patch method
type RequestWithBody = (
  url: Url,
  body?: any,
  query?: Query,
  runtimeConfig?: RequestInit,
) => Promise<any>
