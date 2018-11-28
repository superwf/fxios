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
type RequestCallback = (req: Request) => Request
type CatchCallback = (err: Error, req: Request) => any

// 拦截器
interface Interceptor {
  request: RequestCallback[]
  response: ResponseCallback[]
  catch: CatchCallback[]
}

type RequestFunction = (
  url: string,
  option?: Option,
  runtimeConfig?: RequestInit,
) => Promise<any>
