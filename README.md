# Fxios

## Introduction [中文版](./README.cn.md)

## inspired by axios, build with typescript, encapsulate origin fetch

## fxios = fetch + axios

## Notice! latest version 2 has some break changes with previous version

## version 2.1 changelog

* add umd format.

```
<script src="//unpkg.com/fxios@latest/dist/index.min.js"></script>
```

## version 2 changelog

* new Fxios(config) changed, change `base` to `baseURL`, to keep same data structure with the `runtimeConfig`.

* all interceptor change from array to single function.

* interceptor request changed, each request interceptor should return the same arguments with the fxios request method, the arguments is `url, option, runtimeConfig`，`option` and `runtimeConfig` is optional. each request interceptor must return an array with these three arguments, as [url: string, option?: FxiosOption, runtimeConfig?: FxiosConfig].

* add `extendHttpMethod` for extend new http method expect `get`, `post`, `put`, `delete`, `head`, `patch`.

* remove inherit from `events` lib, because the event system should be out of fxios.

* add Chinese doc.

## Install

```bash
npm install fxios
```

## Example

```javascript
const fxios = new Fxios()
async function createUser() {
  const result = await fxios.post('/api/user', { body: { name: 'abc' } })
  return result
}
```

More detail see [example.js](./example.js)

## Usage

### Class API

```javascript
import { Fxios } from 'fxios'
const fxios = new Fxios(config)
```

if no config param for `new Fxios()`, the default below will be used.

```js
{
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
}
```

if there is config param, the config param will be merged with the default config.

The `config` type is `FxiosConfig`, type structure as below:

```javascript
{
  // like axios baseURL，will be the prefix of url for each request
  baseURL: '',
  // except baseURL，all other props should be available to `window.fetch`
  // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
}
```

### Instance Api

```javascript
const fxios = new Fxios()
```

fxios#get(url: string[, option: [FxiosOption](#option), runtimeConfig: [FxiosConfig](#runtimeConfig) ])

fxios#post(url: string[, option: [FxiosOption](#option), runtimeConfig: [FxiosConfig](#runtimeConfig) ])

fxios#put(url: string[, option: [FxiosOption](#option), runtimeConfig: [FxiosConfig](#runtimeConfig) ])

fxios#patch(url: string[, option: [FxiosOption](#option), runtimeConfig: [FxiosConfig](#runtimeConfig) ])

fxios#delete(url: string[, option: [FxiosOption](#option), runtimeConfig: [FxiosConfig](#runtimeConfig) ])

each method has already bound to the instance, so

```javascript
const get = fxios.get
...
get(...) // the same as invoke fxios.get(...)
```

### At version 2 there is `extendHttpMethod` method

when need more http method request, use `extendHttpMethod` to generate new method for fxios. For example:

```javascript
fxios.extendHttpMethod('head')
// then there is a `head` method
fxios.head(url, option, runtimeConfig)
```

### FxiosOption，the second param

Plain javascript object, could include three properties.
All properties is optional.

```javascript
{
  query?: [Query](#query)
  param?: [Param](#param)
  body?: any
}
```

When use `get` http method, `body` property is useless and should not be assigned.

### Query, the url part after `?`

Plain javascript object, will be transformed to search. For example `{ name: 'abc' }` => `'name=abc'`

### Param, the route path variable

when you use an url like `/api/user/:id/edit`, then use `param` for replace the `:id` part.

```javascript
fxios.get('/api/user/:id/edit', {
  param: {
    id: '124'
  }
})
```

the url will be transformed to '/api/user/124/edit' when request.

### Request body

ArrayBuffer | ArrayBufferView | NodeJS.ReadableStream | string | URLSearchParams | FormData

For example:

```javascript
fxios.post('/api/user', {
  body: 'abc' // or new FormData(...) something
})
```

when body is plain object，the body will be stringified，and fxios auto add `{'Content-Type': 'application/json'}` to headers.

### RuntimeConfig, the third param for request, could be used for overwrite the fxios config, data structure type is `FxiosConfig`

All runtimeConfig properties will be merged with the config when instantiating `new Fxios(config)`.

### Interceptor, like `transformRequest` and `transformResponse` in `axios`

All Fxios interceptors are plain javascript array, use push method(or any array methods up to you) to add new interceptor.
For example:

```javascript
fxios.interceptor.request = function(url, option, runtimeConfig) {...}
fxios.interceptor.response = function(response, request) {...}
fxios.interceptor.catch = function(error, request) {...}
```

#### `interceptor.request`

The last member function return value will be used for request value
The member function sign is:

```javascript
type RequestCallback = (url: string, option?: FxiosOption, runtimeConfig?: FxiosConfig) => [url: string, option?: FxiosOption, runtimeConfig?: FxiosConfig]
```

#### interceptor.request

The first response callback accept the origin fetch Response object, and the latter function will accept the result returned by the previous one.
See [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
The second Request param is readonly, is the request object.
See [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
The last function returned promise resolved value is the fxios resolved value.

array, each member function sign is

```javascript
type ResponseCallback = (res: any, req: Request) => any
```

#### `interceptor.catch`

Each catch member function will catch the error. If you want to the next catch interceptor to receive the previous processed error, you must rethrow the error.
The second Request param is readonly.

```javascript
type CatchCallback = (err: Error, req: Request) => any
```
