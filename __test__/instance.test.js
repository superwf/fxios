import Fxios from '../index.ts'
import URL from 'url'
// import fetch, { config } from '../example'
// const fetchMock = require('fetch-mock')
import fetchMock from 'fetch-mock'

// const noop = () => {}

const mockData = {
  get: { code: 'success', message: 'ok', data: [] },
  post: { code: 'success', message: 'ok', data: [] },
}

const mockUrls = {
  get: '/get',
  post: '/post',
}

const httpMethods = ['get', 'post', 'put', 'delete']

describe('fetch', () => {
  afterAll(() => {
    fetchMock.restore()
  })

  beforeAll(() => {
    fetchMock.get(mockUrls.get, mockData.get)
    fetchMock.post(mockUrls.post, mockData.post)
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

  httpMethods.forEach(method => {
    it(`${method}方法，测试路由函数`, () => {
      const getWithRouterParam = '/get/superwf/edit/33'
      fetchMock[method](getWithRouterParam, mockData.get)
      const fxios = new Fxios()
      return fxios
        .get({ url: '/get/:name/edit/:id', param: { name: 'superwf', id: 33 } })
        .then(res => {
          expect(res).toBeInstanceOf(Response)
          return res.text().then(d => {
            expect(d).toEqual(JSON.stringify(mockData.get))
          })
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

  it('get方法，测试interceptor.request', () => {
    const query = { abc: 'xyz' }
    const fxios = new Fxios()
    fxios.interceptor.request.push(req => {
      const url = URL.parse(req.url, true)
      url.query.name = 'def'
      delete url.search
      req.url = URL.format(url)
      return req
    })
    const url = URL.format({
      pathname: mockUrls.get,
      query: { abc: 'xyz', name: 'def' },
    })
    fetchMock.get(url, mockData.get)
    return fxios.get(mockUrls.get, query).then(res => {
      expect(res).toBeInstanceOf(Response)
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

  it('post方法，测试post object', () => {
    const data = { name: '123' }
    const fxios = new Fxios()
    return fxios.post(mockUrls.post, data).then(res => {
      const lastPost = fetchMock.lastCall()[0]
      expect(lastPost.body).toBe(JSON.stringify(data))
    })
  })

  it('post方法，测试post string', () => {
    const data = 'abcdefaesdf'
    const fxios = new Fxios()
    return fxios.post(mockUrls.post, data).then(res => {
      const lastPost = fetchMock.lastCall()[0]
      expect(lastPost.body).toBe(data)
    })
  })

  it('post方法，测试post Buffer', () => {
    const data = new Buffer.alloc(8)
    const fxios = new Fxios()
    return fxios.post(mockUrls.post, data).then(res => {
      const lastPost = fetchMock.lastCall()[0]
      expect(lastPost.body).toBe(data)
    })
  })
})
