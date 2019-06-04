# Fxios V3

## Introduction [中文版](./README.cn.md)

[v2 doc](./README.2.md)

inspired by axios, build with typescript, encapsulate origin fetch

fxios = fetch + axios

## Usage

### in browser

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

### local install

```bash
npm install fxios
// or
yarn add fxios
```

### default export an available instance

```typescript
import fxios from 'fxios'

type ResType = {success: boolean}

async function createUser() {
  const result = await fxios.post<ResType>('/api/user', { body: { name: 'abc' } })
  return result
}
```

more to see: [example.ts](./example.ts)

### create new instance

```js
import fxios, { Fxios } from 'fxios'

const f1 = new Fxios(config)
// or
const f2 = Fxios.create(config)
// or
const f3 = fxios.create(config)
```

the config for create new instance is `FxiosConfig`，data structure as below:

```typescript
{
  // like axios baseURL，default blank.
  baseURL: '',
  // except baseURL, all other property inherit from RequestInit
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
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

the request option will overwrite the instance config property
as below

```typescript

fxios.get({
  url: '/api/users',
  mode: 'cors',
})

```

### Instance Api

fxios#request<T>(option: IFxiosRequestOption | string)

the option could be a string
as below：

```typescript
fxios.get('/api/users')
```

all other case，should use object option `IFxiosRequestOption`，
as below：

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

IFxiosRequestOption data structure

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

these instance methods are all short cut of `fxios#request`.

fxios#get

fxios#post

fxios#put

fxios#patch

fxios#delete

fxios#head

fxios#options

each method has already bind to the instance，need not to call like `bind(fxios)`

```typescript
const get = fxios.get
...
get(...) // same as fxios.get(...)
```

`path` is the parameter in the url path：
the below request will call this url: '/api/user/123/edit'。

```typescript
fxios.get({
  url: '/api/user/:id/edit',
  path: {
    id: '123'
  }
})
```

when body is simple object, it will be JSON.stringify，and auto add `{'Content-Type': 'application/json'}` to the request header,
other case, body will not be auto transformed.

as below:

```typescript
fxios.post('/api/user', {
  body: 'abc', // or { name: 'abc' }
})
```

### Interceptor

each instance has `interceptor` property，like `transformRequest` and `transformResponse` in axios.

interceptor has three property，`request`、`response`、`catch`。

```typescript

fxios.interceptor.request = function(option: IFxiosRequestOption): IFxiosRequestOption {...}

fxios.interceptor.response = function(res: Response, req?: IFxiosRequestOption ): any {...}

fxios.interceptor.catch = function(error: Error, req?: IFxiosRequestOption): any {...}
```
