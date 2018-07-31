## Fxios

##### inspired by axios, use typescript

### Install

```bash
npm install fxios
```


#### example or see [example.js](https://github.com/superwf/fxios/blob/master/example.js)
```
const fxios = new Fxios()
async function createUser() {
  const result = await fxios.post('/api/user')
  return result
}
```

### Usage

#### API

```js
import { Fxios } from 'fxios'
const instance = new Fxios()
```

default new config
```js
{
  base: '/api', // like axios baseURL, default is ''
  // other param for the fetch default param
  // expect base，other param must be acceptable for origin window.fetch
  // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
}
```
the default config will be merged with your config


#### new Fxios(config)
| method | param |
|---|---|
| get | [URL Object](#url-object),<br>query object, optional,<br>[runtimeConfig](#runtimeconfig) optional|
| post | [URL Object](#url-object),<br>[body](#request-body): string or object<br>query object, optional,<br>[runtimeConfig](#runtimeconfig) optional |
| delete | same as post |
| put | same as post |
| patch | same as post |

each method has already bound to the instance, so
```
fxios.get(...)
const get = fxios.get
get(...) // same as fxios.get
```

#### URL Object

the url object could be a string, like '/api/user/124/edit'
or sometimes the router param need be inserted at run time, then it could be an object like
```
{
  url: '/api/user/:id/edit',
  param: {
    id: '124'
  }
}
```
it will be converted to '/api/user/124/edit' before request.

#### Request body
ArrayBuffer | ArrayBufferView | NodeJS.ReadableStream | string | URLSearchParams

#### RuntimeConfig
runtimeConfig object, all property must be acceptable for origin window.fetch
see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
for example
```
{
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
  ...
}
```
all config will be merged with the config when `new Fxios(config)`. if no instance config, the default config will work.

#### Interceptor

Inspired by axios interceptor.
All Fxios interceptors are only javascript array, use push method to add new interceptor.
For example:
```
fxios.interceptor.request.push(function(request) {...})
fxios.interceptor.response.push(function(response, request) {...})
fxios.interceptor.catch.push(function(error, request) {...})
```

`interceptor.request` is an array, each member function sign is
```
type RequestCallback = (res: Request) => Request
```
See [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)

`interceptor.request` is an array, each member function sign is
```
type ResponseCallback = (res: any, req: Request) => any
```
The first response callback accept the origin fetch Response object, and the latter function will accept the result returned by the previes one.
The second Request param will not change.
See [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)

`interceptor.catch` is an array, each member function sign is
```
type CatchCallback = (err: Error, req: Request) => any
```

#### EventEmitter
Fxios extends the nodejs EventEmitter api
So it has all the EventEmitter api,
If you would like to know more, please read [EventEmitter api](https://nodejs.org/api/events.html)
here is some methods example
The event methods could be used when request succeed or failed, to tell the ui to show something.

| method | param |
|---|---|
| on | event name: string, callback: function |
| off | event name: string, callback: function |
| emit | string, [any] |
