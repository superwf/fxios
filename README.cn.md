# Fxios

## 介绍 [English doc](./README.md)

## 开发过程参照了axios的接口设计，使用typescript编写，对原生fetch进行封装

## fxios = fetch + axios

## 注意! 2.0版本接口变动较大，对之前的版本api进行了一些不兼容修改

## 版本2.0变更记录

* new Fxios(config)，`config`参数中的`base`属性改为`baseURL`，在实际发起请求的`runtimeConfig`中对应的属性也改为了`baseURL`。

* 所有拦截器成员都改为普通函数。

* request拦截器参数变更，每个拦截器接收三个参数`url`，`option`，`runtimeConfig`，并且必须返回由这三个参数构成的数组供下一个请求拦截器使用。

* 新方法`extendHttpMethod`可以扩展fxios的请求方法。生成除了`get`, `post`, `put`, `delete`, `patch`之外的新方法。

* 取消`Fxios`继承`Events`，事件处理应在fxios外部进行。

* 添加了中文文档。

## 安装

```bash
npm install fxios
```

## 例子

```javascript
const fxios = new Fxios()
async function createUser() {
  const result = await fxios.post('/api/user', { body: { name: 'abc' } })
  return result
}
```

其他例子参考: [example.js](./example.js)

## 使用方法

### 类方法: 生成实例

```js
import { Fxios } from 'fxios'
const fxios = new Fxios(config)
```

在`new Fxios()`时如果不传入配置，则使用如下默认配置

```js
{
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
}
```

若传入`config`则将与default进行合并，传入的`config`项将覆盖`defaultConfig`。

在生成实例时的参数类型为`FxiosConfig`，数据结构如下:

```javascript
{
  // 类似axios的baseURL，会自动添加到每次请求的url前面，默认为空。
  baseURL: '',
  // 除了baseURL之外的其他属性，都应是原生fetch可接受的属性。
  // 其他属性参照 https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
}
```

在运行时的runtimeConfig将会与创建实例时的config合并使用，有重名属性时`runtimeConfig`内的值会覆盖生成实例时的`config`对应的值。


#### 实例Api

```javascript
const fxios = new Fxios()
```

fxios#get(url: string[, option: [FxiosOption](#option), runtimeConfig: [FxiosConfig](#runtimeConfig) ])

fxios#post(url: string[, option: [FxiosOption](#option), runtimeConfig: [FxiosConfig](#runtimeConfig) ])

fxios#put(url: string[, option: [FxiosOption](#option), runtimeConfig: [FxiosConfig](#runtimeConfig) ])

fxios#patch(url: string[, option: [FxiosOption](#option), runtimeConfig: [FxiosConfig](#runtimeConfig) ])

fxios#delete(url: string[, option: [FxiosOption](#option), runtimeConfig: [FxiosConfig](#runtimeConfig) ])

以上的每个方法都已经与fxios实例绑定，在调用时不需要再`bind(fxios)`实例

```javascript
const get = fxios.get
...
get(...) // 与调用fxios.get(...)相同，已经绑定fxios为get内的this
```

#### version 2 新增 `extendHttpMethod`方法。

如果需要除上述基础方法之外的http请求，可以通过`extendHttpMethod`扩展fxios实例的方法。例如需要扩展`head`方法

```javascript
fxios.extendHttpMethod('head')
// 然后即可调用head方法
fxios.head(url, option, runtimeConfig)
```

### FxiosOption，发起get, post等请求时的在url参数后面的第二个参数。

普通js对象, 有一下三个属性，都是可选属性。

```javascript
{
  query?: [Query](#query)
  param?: [Param](#param)
  body?: any
}
```

由于get方法不应该有请求体，当使用get方法时，body属性没有意义，会引起fetch运行错误。

### Query，挂在url上以`?`开头的请求参数

普通js对象，在请求时会被自动转换为字符串，例如`{ name: 'abc' }` => `'name=abc'`

#### Param，路由参数

当请求的url上有以`:`标识的路由参数时，对应名称的参数会用param中对应属性的值自动进行替换。

例如

```javascript
fxios.get('/api/user/:id/edit', {
  param: {
    id: '124'
  }
})
```

会在请求时自动替换为'/api/user/124/edit'。

#### FxiosOption中的body属性，请求体可以是以下这些类型

ArrayBuffer | ArrayBufferView | NodeJS.ReadableStream | string | URLSearchParams | FormData

例如

```javascript
fxios.post('/api/user', {
  body: 'abc' // 或 new FormData(...) 等可以转化为请求体的类型
})
```

当body是普通js对象时，会转换为json字符串，并自动在header中添加`{'Content-Type': 'application/json'}`

#### RuntimeConfig，请求的时的第三个参数，请求时可替换生成实例时的配置的配置，数据结构与`FxiosOption`一致。可覆盖实例`config`中重名的属性

在运行时的runtimeConfig将会与创建实例时的config合并使用，有重名属性时`runtimeConfig`内的值会覆盖生成实例时的`config`对应的值。

### Interceptor拦截器，与axios中的`transformRequest`与`transformResponse`类似。

interceptor对象有三个属性对应三种拦截器，`request`、`response`、`catch`。每个拦截器都是普通js数组，在运行时会按数组先后顺序依次执行。也可按需在对应的数组中添加或减少成员函数。

```javascript
fxios.interceptor.request = function(url, option, runtimeConfig) {...}
fxios.interceptor.response = function(response, request) {...}
fxios.interceptor.catch = function(error, request) {...}
```

#### `interceptor.request`请求拦截器

最后一个拦截器函数的返回值将作为fxios实际处理的值。
每个拦截器函数签名如下:

```javascript
type RequestCallback = (url: string, option?: FxiosOption, runtimeConfig?: FxiosConfig) => [url: string, option?: FxiosOption, runtimeConfig?: FxiosConfig]
```

#### `interceptor.request`响应拦截器

第一个响应拦截器的第一个`res`参数是fetch的Response类型。
参考[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
之后的每个拦截器函数的第一个参数，是上一个拦截器函数返回promise的resolve值。
第二个参数的req只读，是本次请求的request信息，是fetch的Request类型对象，
参考[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
返回经过处理的数据，会作为下一个拦截器函数的第一个入参。
最后一个拦截器返回的数据就是fxios返回的promise对象的resolve值。

```javascript
type ResponseCallback = (res: any, req: Request) => any
```

#### `interceptor.catch`错误拦截器

每个错误拦截器的第一个参数是请求过程中发生的错误对象或数据。
每个错误拦截器函数若需将错误处理后，仍然运行下一个错误拦截器，需要在函数中`throw`需要传给下一个函数的数据或错误。
第二个参数的req只读，是本次请求的request信息，是fetch的Request类型对象，

```typescript
type CatchCallback = (err: Error, req: Request) => any
```
