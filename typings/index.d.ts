// 作为路由参数的url
interface UrlWithRouterParam {
  url: string
  param: string
}

type Url = string | UrlWithRouterParam

// url query 对象
interface Query {
  [index: string]: string
}

// 实例化的配置参数
interface FxiosConfig {
  base?: string
  request?: RequestInit
}

// 实例化的配置参数
type ResponseCallback = (res: any, req: RequestInit) => any
type RequestCallback = (res: Request) => Request

// 拦截器
interface Interceptor {
  request: RequestCallback[]
  response: ResponseCallback[]
}
