// 发起请求时的通用参数
interface FxiosRequestOption {
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
  baseURL?: string
}

// 实例化的配置参数
type ResponseCallback = (res: any, req: Request) => any
type RequestCallback = (
    url: string,
    option?: FxiosRequestOption,
    runtimeConfig?: FxiosConfig,
) => [string, FxiosRequestOption | undefined, FxiosConfig | undefined]
type CatchCallback = (err: Error, req: Request) => any

// 拦截器
interface Interceptor {
  request: RequestCallback[]
  response: ResponseCallback[]
  catch: CatchCallback[]
}

type RequestFunction = (
  url: string,
  option?: FxiosRequestOption,
  runtimeConfig?: RequestInit,
) => Promise<any>

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'
