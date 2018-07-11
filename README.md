## Fxios

### inspired by axios, use typescript

### 安装

```bash
npm install fxios
```

启动项目时可能会提示babel的preset缺少react-app，先
```bash
npm i babel-preset-react-app -D
```

### 例子 参见当前项目中的example.js

### 使用方法

### API

```js
import { Fxios } from 'fxios'
const instance = new Fxios()
```

config通常配置
```js
{
  base: '/api', // like axios baseURL, default is ''
  // other param for the fetch default param，除了base，其他项都必须是原生fetch可接受的参数
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
}
```

#### new Fxios(config)

config is an object that

#### 实例方法
| 方法 | 参数 | 说明 |
|---|---|---|
| get | string url请求地址<br /> [query][Object&#124;String]，url上的query对象或字符串，如{abc: 'def'}或'abc=def'，以下所有query参数说明相同<br> [runtimeConfig] 发生请求时的fetch的config, 会与配置的config合并生效 |
| post | url请求地址, data, [query] | url, Object, [Object|String], [runtimeConfig] |
| delete, put | same as post |
| on | string, function | eventName, Function(...args) 监听函数，参数由emit发射出去的决定 |
| off | string, function | eventName, func，移除eventName事件队列中的该监听函数 |
| emit | string, [any] | eventName, 任何想要发射的数据，可多个 |
| interceptor.request[] | cb: (req: Request) => Request | 在请求前拦截request对象 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)对象 |
| interceptor.response[] | cb: (res: Response, req: Request) => Request | 处理返回后的response对象 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)对象 |
| interceptor.response.catch[] | cb: (err: Error, req: Request) => Request | 处理fetch错误。若有多个catch处理函数，第一个catch error之后若想后面的函数继续执行则需要再throw error |

#### interceptor

参照了axios的interceptor接口
interceptor.request与interceptor.response都是纯数组，成员是函数
interceptor.request的每个函数必须返回处理过的request对象。
interceptor.response的第一个函数接收的是fetch返回的Response对象和本次请求的Request对象。之后的函数的第一个参数都是上一个函数的返回值，第二个参数为Request对象不变。
interceptor.catch的第一个参数是抛出的error，第二个参数为Request对象不变。

### 实例属性

| 名称 | 说明 |
|---|---|---|
| base | 生成实例对象时传入的config的base, 可随时更改，更改后在下一个请求立即生效 |
| config | 生成实例对象时传入的config除base外的其他属性，必须是fetch可接收的属性 |
| emitter | 一个EveitEmitter对象实例，fetch的on, off，emit都是emitter的方法，也可直接调用emitter的方法 |

emitter可直接参考nodejs的[events api](https://nodejs.org/api/events.html)
