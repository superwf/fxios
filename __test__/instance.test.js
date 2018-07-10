import Fxios from '../index.ts'
// import fetch, { config } from '../example'
// const fetchMock = require('fetch-mock')
import fetchMock from 'fetch-mock'

// const noop = () => {}

const mockData = {
  get: { code: 'success', message: 'ok', data: [] },
}

// const query = { abc: 'xyz' }
// const data = { name: '123' }
const mockUrls = {
  get: '/get',
}

describe('fetch', () => {
  afterAll(() => {
    fetchMock.restore()
  })

  beforeAll(() => {
    fetchMock.get(mockUrls.get, mockData.get)
  })

  it('get方法，无intern.response，直接获取Response类型数据', () => {
    const fxios = new Fxios()
    return fxios.get(mockUrls.get).then(res => {
      expect(res).toBeInstanceOf(Response)
      return res.json().then(d => {
        expect(d).toEqual(mockData.get)
      })
    })
  })

  it('get方法，测试res.text()', () => {
    const fxios = new Fxios()
    return fxios.get(mockUrls.get).then(res => {
      expect(res).toBeInstanceOf(Response)
      return res.text().then(d => {
        expect(d).toEqual(JSON.stringify(mockData.get))
      })
    })
  })

  it('get方法，通过interceptor处理数据', () => {
    const fxios = new Fxios()
    fxios.interceptor.response.push((res, req) => {
      if (!res.ok) {
        const error = new Error(res.statusText)
        error.response = res
        error.request = req
        throw error
      }
      return res.json().then(data => {
        return data
      })
    })
    return fxios.get(mockUrls.get).then(res => {
      expect(res).toEqual(mockData.get)
    })
  })

  it('get方法，测试emitter', () => {
    const spy = jest.fn()
    const fxios = new Fxios()
    fxios.on('success', spy)
    fxios.interceptor.response.push((res, req) => {
      if (!res.ok) {
        const error = new Error(res.statusText)
        error.response = res
        error.request = req
        throw error
      }
      return res.json().then(data => {
        fxios.emit('success', data)
        return data
      })
    })
    return fxios.get(mockUrls.get).then(res => {
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0][0]).toEqual(mockData.get)
    })
  })
})
