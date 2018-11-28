## Fxios

### Introduction

##### inspired by axios, build with typescript
##### fxios = fetch + axios

### Notice !!!Version 1.0.0 api changed, not compactible with 0.5.x

### Install

```bash
npm install fxios
```

#### example
```
const fxios = new Fxios()
async function createUser() {
  const result = await fxios.post('/api/user', { body: { name: 'abc' } })
  return result
}
```
More detail see [example.js](https://github.com/superwf/fxios/blob/master/example.js)

### Usage

#### API

```js
import { Fxios } from 'fxios'
const fxios = new Fxios()
```

default new config
```js
{
  base: '/api', // like axios baseURL, default is ''
  // other param for the fetch default param
  // except 'base'，other props must be acceptable for origin window.fetch
  // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
}
```
the default config will be merged with your config


#### Instance Api
```javascript
const fxios = new Fxios()
```

fxios#get(url: string[, option: [Option](#option), runtimeconfig: [RuntimeConfig](#runtimeconfig) ])

fxios#post(url: string[, option: [Option](#option), runtimeconfig: [RuntimeConfig](#runtimeconfig) ])

fxios#put(url: string[, option: [Option](#option), runtimeconfig: [RuntimeConfig](#runtimeconfig) ])

fxios#patch(url: string[, option: [Option](#option), runtimeconfig: [RuntimeConfig](#runtimeconfig) ])

fxios#delete(url: string[, option: [Option](#option), runtimeconfig: [RuntimeConfig](#runtimeconfig) ])

each method has already bound to the instance, so
```
fxios.get(...)
const get = fxios.get
get(...) // same as fxios.get
```

the url will be transformed to '/api/user/124/edit' when request.

#### Option
Plain javascript object, could include three properties

```
{
  query?: [Query](#query)
  param?: [Param](#param)
  body?: any
}
```

When use `get` http method, `body` property is useless and should not be assigned.

#### Query
Plain javascript object, will be transformed to search. For example `{ name: 'abc' }` => `'name=abc'`

#### Param

the url object could be a string, like '/api/users'
or sometimes the router param need to be generated at run time, like '/api/user/123/edit', then it could be an object whick has the shape as:

```javascript
fxios.get('/api/user/:id/edit', {
  param: {
    id: '124'
  }
})
```
the url will be transformed to '/api/user/124/edit' when request.

#### Request body
ArrayBuffer | ArrayBufferView | NodeJS.ReadableStream | string | URLSearchParams

#### RuntimeConfig
RuntimeConfig object, all property must be acceptable for origin [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch\_API)
for example:
```
{
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
  ...
}
```
All runtimeConfig properties will be merged with the config when instantiating `new Fxios(config)`. If no instance config, the default config works.

#### Interceptor

Inspired by axios interceptor too.
All Fxios interceptors are plain javascript array, use push method(or any array methods up to you) to add new interceptor.
For example:
```
fxios.interceptor.request.push(function(request) {...})
fxios.interceptor.response.push(function(response, request) {...})
fxios.interceptor.catch.push(function(error, request) {...})
```

##### `interceptor.request` array
See [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
Each member accept a Request object returned by the previous one, and must return a Request object. The last returned Request object will be used to perform remote request.
the array member function sign is
```
type RequestCallback = (res: Request) => Request
```

##### `interceptor.request`  array, each member function sign is
The first response callback accept the origin fetch Response object, and the latter function will accept the result returned by the previous one.
The second Request param is readonly.
See [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
```
type ResponseCallback = (res: any, req: Request) => any
```

##### `interceptor.catch` is an array, each member function sign is
Each catch member function will catch the error. If you want to the next catch interceptor to receive the previous processed error, you must rethrow the error.
The second Request param is readonly.
```
type CatchCallback = (err: Error, req: Request) => any
```

#### EventEmitter
Fxios extends the nodejs EventEmitter
So it has all the EventEmitter api,
If you would like to know more, please read [EventEmitter api](https://nodejs.org/api/events.html)
The event methods could be used when request succeed or failed, to tell the ui to show something.
Here are some methods example:

| method | param |
|---|---|
| on | event name: string, callback: function |
| off | event name: string, callback: function |
| emit | string, [any] |
