import {
  Fxios,
  jsonType,
  defaultRequestConfig,
  isPlainObject,
} from '../index.ts'
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
  beforeEach(() => {
    fetchMock.restore()
  })

  it('测试isPlainObject', () => {
    function Foo() {
      this.a = 'a'
    }
    expect(isPlainObject(new Foo())).toBe(false)
    expect(isPlainObject([1, 2, 3])).toBe(false)
    expect(isPlainObject({ x: 1, y: 2 })).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
    expect(isPlainObject(Object.create({ a: 1 }))).toBe(false)
  })

  it('get方法，无intern.response，直接获取Response类型数据', () => {
    const fxios = new Fxios()
    fetchMock.get(mockUrls.get, mockData.get)
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
      return fxios[method]({
        url: '/get/:name/edit/:id',
        param: { name: 'superwf', id: 33 },
      }).then(res => {
        expect(res).toBeInstanceOf(Response)
        return res.text().then(d => {
          expect(d).toEqual(JSON.stringify(mockData.get))
        })
      })
    })

    it(`${method}方法，测试路由函数，param可为空值`, () => {
      fetchMock[method](mockUrls.get, mockData.get)
      const fxios = new Fxios()
      return fxios[method]({
        url: mockUrls.get,
      }).then(res => {
        expect(res).toBeInstanceOf(Response)
        return res.text().then(d => {
          expect(d).toEqual(JSON.stringify(mockData.get))
        })
      })
    })

    it(`${method}方法，测试url base`, () => {
      const withBase = '/api/get'
      fetchMock[method](withBase, mockData.get)
      const fxios = new Fxios({ base: '/api' })
      return fxios[method]('/get').then(res => {
        expect(res).toBeInstanceOf(Response)
      })
    })

    it(`${method}方法，测试res.text()`, () => {
      const fxios = new Fxios()
      fetchMock[method](mockUrls.get, mockData.get)
      return fxios[method](mockUrls.get).then(res => {
        expect(res).toBeInstanceOf(Response)
        return res.text().then(d => {
          expect(d).toEqual(JSON.stringify(mockData.get))
        })
      })
    })

    it(`${method}方法，测试定制headers`, () => {
      const headers = {
        'x-request': 'power',
      }
      const fxios = new Fxios({ headers })
      fetchMock[method](mockUrls.get, mockData.get)
      fxios.interceptor.request.push(req => {
        expect(req.headers._headers).toEqual({
          'x-request': ['power'],
        })
        return req
      })
      return fxios[method](mockUrls.get).then(res => {
        expect(res).toBeInstanceOf(Response)
      })
    })

    if (method !== 'get') {
      it(`${method}方法，测试定制headers，与提交对象是自动添加的json header`, () => {
        const headers = {
          'x-request': 'power',
        }
        const fxios = new Fxios({ headers })
        fetchMock[method](mockUrls.get, mockData.get)
        fxios.interceptor.request.push(req => {
          expect(req.headers._headers).toEqual({
            'x-request': ['power'],
            'content-type': [jsonType],
          })
          return req
        })
        const data = { name: 'abc' }
        return fxios[method](mockUrls.get, data).then(res => {
          expect(res).toBeInstanceOf(Response)
        })
      })

      it(`${method}方法，测试默认requestConfig.redirect`, () => {
        const fxios = new Fxios()
        fetchMock[method](mockUrls.get, mockData.get)
        fxios.interceptor.request.push(req => {
          // other defaultRequestConfig props are not in req
          // because node-fetch is not really browser fetch
          expect(req.redirect).toBe(defaultRequestConfig.redirect)
          return req
        })
        return fxios[method](mockUrls.get).then(res => {
          expect(res).toBeInstanceOf(Response)
        })
      })

      it(`${method}方法，测试runtimeConfig`, () => {
        const fxios = new Fxios()
        fetchMock[method](mockUrls.get, mockData.get)
        fxios.interceptor.request.push(req => {
          expect(req.redirect).toBe('error')
          return req
        })
        return fxios[method](mockUrls.get, undefined, undefined, {
          redirect: 'error',
        }).then(res => {
          expect(res).toBeInstanceOf(Response)
        })
      })
    }
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
    fetchMock.get(mockUrls.get, mockData.get)
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

  it('get方法，测试emitter', async () => {
    const spy = jest.fn()
    const fxios = new Fxios()
    fetchMock.get(mockUrls.get, mockData.get)
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
    await fxios.get(mockUrls.get)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toEqual(mockData.get)

    fxios.off('success', spy)
    await fxios.get(mockUrls.get)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('post方法，测试post object', async () => {
    const data = { name: '123' }
    const fxios = new Fxios()
    fetchMock.post(mockUrls.post, mockData.post)
    await fxios.post(mockUrls.post, data)
    let lastPost = fetchMock.lastCall()[0]
    expect(lastPost.body).toBe(JSON.stringify(data))
    await fxios.post(mockUrls.post, Object.create(null))
    lastPost = fetchMock.lastCall()[0]
    expect(lastPost.body).toBe(JSON.stringify({}))
  })

  it('post方法，测试post string', () => {
    const data = 'abcdefaesdf'
    const fxios = new Fxios()
    fetchMock.post(mockUrls.post, mockData.post)
    return fxios.post(mockUrls.post, data).then(res => {
      const lastPost = fetchMock.lastCall()[0]
      expect(lastPost.body).toBe(data)
    })
  })

  it('post方法，测试post Buffer', () => {
    const data = new Buffer.alloc(8)
    const fxios = new Fxios()
    fetchMock.post(mockUrls.post, mockData.post)
    return fxios.post(mockUrls.post, data).then(res => {
      const lastPost = fetchMock.lastCall()[0]
      expect(lastPost.body).toBe(data)
    })
  })

  it('interceptor.catch', done => {
    const fxios = new Fxios()
    fxios.interceptor.catch.push((err, req) => {
      expect(err).toBeInstanceOf(Error)
      expect(req).toBeInstanceOf(Request)
      done()
    })
    fxios.interceptor.response.push((res, req) => {
      if (res.status !== 200) {
        throw new Error(res.status)
      }
    })
    const init = { status: 404 }
    const res = new Response([], init)
    fetchMock.get(mockUrls.get, res)
    fxios.get(mockUrls.get)
  })
})
