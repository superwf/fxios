import { Fxios } from 'fxios'
import Events from 'events'

const emitter = new Events()
const fxios = new Fxios()

// example for auto add language at each url query part
fxios.interceptor.request.push((url, option, runtimeConfig) => {
  option = option || { query: {} }
  option.query = option.query || {}

  const language = cookie.get('language')
  option.query.language = language
  return [url, option, runtimeConfig]
})

// example for process response
fxios.interceptor.response.push((res, req) => {
  if (!res.ok) {
    const error = new Error(res.statusText)
    error.response = res
    throw error
  }
  return res.json().then(data => {
    if (data.code === 'success') {
      res.message = data.message
      if (req.method !== 'GET') {
        emitter.emit('success', res)
      }
      return data
    }
    const error = new Error(data.message)
    error.code = data.code
    error.response = res
    throw error
  })
})

// example for process error
const fxiosCatch = error => {
  // when no listener for an event, it will throw an error.
  if (emitter.listeners('error').length > 0) {
    emitter.emit('error', error)
  }
  throw error
}
fxios.interceptor.catch.push(fxiosCatch)

export default fxios
