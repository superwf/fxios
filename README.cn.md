# Fxios V3

## 介绍 [English doc](./README.md)

[v2 doc](./README.2.cn.md)

开发过程参照了axios的接口设计，使用typescript编写，对原生fetch进行封装

fxios = fetch + axios

## 使用

### 浏览器使用

```html
<script src="//unpkg.com/fxios"></script>
<script type="application/javascript">
fxios.get(...)
fxios.post(...)

const f1 = fxios.create({
  baseURL: '/api',
})
</script>
```

### 本地安装

```bash
npm install fxios
// 或
yarn add fxios
```

### 默认export一个可用实例

```typescript
import fxios from 'fxios'

type ResType = {success: boolean}

async function createUser() {
  const result = await fxios.post<ResType>('/api/user', { body: { name: 'abc' } })
  return result
}
```

其他例子参考: [example.ts](./example.ts)

### 生成新实例

```js
// 默认export一个实例
import fxios, { Fxios } from 'fxios'

const f1 = new Fxios(config)
// 或
const f2 = Fxios.create(config)
// 或
const f3 = fxios.create(config)
```

在生成实例时的参数类型为`FxiosConfig`，数据结构如下:

```typescript
{
  // 类似axios的baseURL，会自动添加到每次请求的url前面，默认为空。
  baseURL: '',
  // 除了baseURL之外的其他属性，都应是原生fetch可接受的属性。
  // 其他属性参照 https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  body?: BodyInit | null;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  integrity?: string;
  keepalive?: boolean;
  method?: string;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  signal?: AbortSignal | null;
  window?: any;
}
```

在请求是传入的参数会覆盖实例本身的config对应的值。
例如

```typescript

fxios.get({
  url: '/api/users',
  mode: 'cors',
})

```

### 实例Api

fxios#request<T>(option: IFxiosRequestOption | string)

如果请求option为string则用get方法请求该url
例如：

```typescript
fxios.get('/api/users')
```

其他所有情况，都用IFxiosRequestOption的对象方式传入参数，
例如：

```typescript
fxios.post({
  url: '/users',
  body: {
    name: 'abc',
  },
  headers: {
    ...,
  },
})
```

请求参数IFxiosRequestOption数据结构

```typescript
export interface IFxiosRequestOption extends RequestInit {
  query?: {
    [index: string]: string | string[] | number | number[] | boolean | boolean[] | undefined
  }
  body?: any
  path?: {
    [index: string]: string | number | boolean | undefined
  }
  formData?: any
  baseURL?: string
  url: string
}
```

以下方法都是request方法的简写形式，将方法名作为http请求的method，其他参数与request方法一致。

fxios#get

fxios#post

fxios#put

fxios#patch

fxios#delete

fxios#head

fxios#options

以上的每个方法都已经与fxios实例绑定，在调用时不需要再`bind(fxios)`实例

```typescript
const get = fxios.get
...
get(...) // 与调用fxios.get(...)相同，已经绑定fxios为get内的this
```

path参数为路径参数，如下：
会在请求时自动替换为'/api/user/124/edit'。

```typescript
fxios.get({
  url: '/api/user/:id/edit',
  path: {
    id: '124'
  }
})
```

body属性，可以是普通对象则自动调用JSON.stringify，并自动在header中添加`{'Content-Type': 'application/json'}`
其他类型的body都会直接传入fetch

例如

```typescript
fxios.post('/api/user', {
  body: 'abc', // 或 { name: 'abc' }
})
```

### 拦截器

每个实例都有interceptor拦截器属性，与axios中的`transformRequest`与`transformResponse`类似。

interceptor对象有三个属性对应三种拦截器，`request`、`response`、`catch`。

```typescript

fxios.interceptor.request = function(option: IFxiosRequestOption): IFxiosRequestOption {...}

fxios.interceptor.response = function(res: Response, req?: IFxiosRequestOption ): any {...}

fxios.interceptor.catch = function(error: Error, req?: IFxiosRequestOption): any {...}
```
