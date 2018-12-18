import {
  Fxios,
  jsonType,
  defaultRequestConfig,
  isPlainObject,
} from '../index.ts'
import URL from 'url'
import fetchMock from 'fetch-mock'

const mockData = {
  get: { code: 'success', message: 'ok', data: [] },
  post: { code: 'success', message: 'ok', data: [] },
}

const mockUrls = {
  get: '/get',
  post: '/post',
}

const httpMethods = ['get', 'post', 'put', 'delete', 'patch']

describe('fetch', () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  it('测试isPlainObject', () => {
    function Foo() {
      this.a = 'a'
    }
    expect(isPlainObject(new Foo())).toBe(false)
    expect(isPlainObject([1, 2, 3])).toBe(true)
    expect(isPlainObject({ x: 1, y: 2 })).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
    expect(isPlainObject(Object.create({ a: 1 }))).toBe(false)
  })

  it('get方法，无intern.response，直接获取Response类型数据', async () => {
    const fxios = new Fxios()
    fetchMock.get(mockUrls.get, mockData.get)
    const res = await fxios.get(mockUrls.get)
    expect(res).toBeInstanceOf(Response)
    // console.log(fetchMock.lastCall())
    return res.json().then(d => {
      expect(d).toEqual(mockData.get)
    })
  })

  httpMethods.forEach(method => {
    it(`${method}方法，测试路由函数`, () => {
      const getWithRouterParam = '/get/superwf/edit/33'
      fetchMock[method](getWithRouterParam, mockData.get)
      const fxios = new Fxios()
      return fxios[method]('/get/:name/edit/:id', {
        param: { name: 'superwf', id: 33 },
      }).then(res => {
        expect(res).toBeInstanceOf(Response)
        return res.text().then(d => {
          // expect(d).toEqual(JSON.stringify(mockData.get))
        })
      })
    })

    it(`fxios.${method}方法已与fxios绑定，可以不被fxios调用单独执行，效果不变`, () => {
      const getWithRouterParam = '/get/superwf/edit/33'
      fetchMock[method](getWithRouterParam, mockData.get)
      const fxios = new Fxios()
      const request = fxios[method]
      return request('/get/:name/edit/:id', {
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
      return fxios[method](mockUrls.get).then(res => {
        expect(res).toBeInstanceOf(Response)
        return res.text().then(d => {
          expect(d).toEqual(JSON.stringify(mockData.get))
        })
      })
    })

    it(`${method}方法，测试url baseURL`, () => {
      const withBase = '/api/get'
      fetchMock[method](withBase, mockData.get)
      const fxios = new Fxios({ baseURL: '/api' })
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
        'X-Request': 'power',
      }
      const fxios = new Fxios({ headers })
      fetchMock[method](`${mockUrls.get}/abc`, mockData.get)
      fxios.interceptor.request.push((url, option, runtimeConfig) => {
        return [`${url}/abc`, option, runtimeConfig]
      })
      return fxios[method](mockUrls.get).then(res => {
        const lastCall = fetchMock.lastCall()
        expect(lastCall[0].headers._headers).toEqual({
          'x-request': ['power'],
        })
        expect(res).toBeInstanceOf(Response)
      })
    })

    if (method !== 'get') {
      it(`${method}方法，测试定制headers，与提交对象是自动添加的json header`, () => {
        const headers = {
          'X-Request': 'power',
        }
        const fxios = new Fxios({ headers })
        fetchMock[method](mockUrls.get, mockData.get)
        const data = { name: 'abc' }
        return fxios[method](mockUrls.get, { body: data }).then(res => {
          expect(fetchMock.lastCall()[0].headers._headers).toEqual({
            'x-request': ['power'],
            'content-type': [jsonType],
          })
          expect(res).toBeInstanceOf(Response)
        })
      })

      it(`${method}方法，测试默认requestConfig.redirect`, () => {
        const fxios = new Fxios()
        fetchMock[method](mockUrls.get, mockData.get)
        return fxios[method](mockUrls.get).then(res => {
          // console.log(fetchMock.lastCall())
          expect(fetchMock.lastCall()[0].redirect).toBe(
            defaultRequestConfig.redirect,
          )
          expect(res).toBeInstanceOf(Response)
        })
      })

      it(`${method}方法，测试runtimeConfig`, () => {
        const fxios = new Fxios()
        fetchMock[method](mockUrls.get, mockData.get)
        return fxios[method](mockUrls.get, null, {
          redirect: 'error',
        }).then(res => {
          expect(fetchMock.lastCall()[0].redirect).toBe('error')
          expect(res).toBeInstanceOf(Response)
        })
      })
    }
  })

  it('get方法，测试interceptor.request', () => {
    const query = { abc: 'xyz' }
    const fxios = new Fxios()
    fxios.interceptor.request.push((url, option, runtimeConfig) => {
      url = URL.parse(url, true)
      url.query.name = 'def'
      delete url.search
      url = URL.format(url)
      return [url, option, runtimeConfig]
    })
    const url = URL.format({
      pathname: mockUrls.get,
      query: { abc: 'xyz', name: 'def' },
    })
    fetchMock.get(url, mockData.get)
    return fxios.get(url, { query }).then(res => {
      expect(fetchMock.lastCall()[0].url).toBe('/get?abc=xyz&name=def')
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

  it('post方法，测试post object', async () => {
    const data = { name: '123' }
    const fxios = new Fxios()
    fetchMock.post(mockUrls.post, mockData.post)
    await fxios.post(mockUrls.post, { body: data })
    let lastPost = fetchMock.lastCall()[0]
    expect(lastPost.body).toBe(JSON.stringify(data))
    await fxios.post(mockUrls.post, { body: Object.create(null) })
    lastPost = fetchMock.lastCall()[0]
    expect(lastPost.body).toBe(JSON.stringify({}))
  })

  it('post方法，测试post string', () => {
    const data = 'abcdefaesdf'
    const fxios = new Fxios()
    fetchMock.post(mockUrls.post, mockData.post)
    return fxios.post(mockUrls.post, { body: data }).then(res => {
      const lastPost = fetchMock.lastCall()[0]
      expect(lastPost.body).toBe(data)
    })
  })

  it('post方法，测试post Buffer', () => {
    const data = new Buffer.alloc(8)
    const fxios = new Fxios()
    fetchMock.post(mockUrls.post, mockData.post)
    return fxios.post(mockUrls.post, { body: data }).then(res => {
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

  it(`测试runtimeConfig更改baseURL`, () => {
    const fxios = new Fxios({
      baseURL: '/api/',
    })
    fetchMock.get('/xxx/abc', mockData.get)
    return fxios
      .get('abc', null, {
        baseURL: '/xxx/',
      })
      .then(res => {
        expect(res).toBeInstanceOf(Response)
      })
  })

  describe('测试自定义http方法', () => {
    it('扩展trace方法', async () => {
      const fxios = new Fxios({})
      expect('trace' in fxios).toBe(false)
      fxios.extendHttpMethod('trace')
      expect('trace' in fxios).not.toBe(false)

      const url = '/xxx/abc'
      fetchMock.mock(url, 200)
      await fxios.trace(url)
      expect(fetchMock.lastCall()[0].method).toBe('trace')
    })
  })
})
