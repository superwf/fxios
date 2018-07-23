import { Fxios } from 'fxios'

const fxios = new Fxios()

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
        fxios.emit('success', res, req)
      }
      return data
    }
    const error = new Error(data.message)
    error.code = data.code
    error.response = res
    throw error
  })
})

const fxiosCatch = error => {
  // when no listener for an event, it will throw an error.
  if (fxios.listeners('error').length > 0) {
    fxios.emit('error', error)
  }
  throw error
}
fxios.interceptor.catch.push(fxiosCatch)

export default fxios
