import { EventEmitter } from 'events'
import fxios, { IFxiosRequestOption } from './'

const emitter = new EventEmitter()

// modify query example
fxios.interceptor.request = (option: IFxiosRequestOption) => {
  if (option.query) {
    const { query } = option
    if (query.firstName && query.lastName) {
      query.name = `${query.firstName} ${query.lastName}`
      delete query.firstName
      delete query.lastName
    }
  }
  return option
}

fxios.interceptor.response = (res: Response) => {
  return res.json()
}

fxios.interceptor.catch = (e: Error) => {
  // when no listener for an event, it will throw an error.
  if (emitter.listeners('error').length > 0) {
    emitter.emit('error', e)
  }
  throw e
}

fxios.get({ url: '/abc' })

export default fxios
