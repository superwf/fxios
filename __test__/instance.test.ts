import { Fxios, jsonType, defaultRequestConfig, isPlainObject } from '../index'
import { FxiosConfig } from '../typings'
import { format, parse } from 'url'
import fetchMock = require('fetch-mock')
import { HttpMethod } from '../typings/index'

const mockData = {
  get: { code: 'success', message: 'ok', data: [] },
  post: { code: 'success', message: 'ok', data: [] },
}

const mockUrls = {
  get: '/get',
  post: '/post',
}

const httpMethods: HttpMethod[] = ['get', 'post', 'put', 'delete', 'patch']

type fetchMockMethod = typeof fetchMock.post

describe('fetch', () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  it('测试isPlainObject', () => {
    class Foo {
      a: string
      constructor() {
        this.a = 'a'
      }
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
    return res.json().then((d: any) => {
      expect(d).toEqual(mockData.get)
    })
  })

  httpMethods.forEach((method: HttpMethod) => {
    it(`${method}方法，测试路由函数`, () => {
      const getWithRouterParam = '/get/superwf/edit/33'
      ;(<fetchMockMethod>fetchMock[method])(getWithRouterParam, {
        body: mockData.get,
      })
      // fetchMock.post(getWithRouterParam, {
      //   body: mockData.get,
      // })
      const fxios = new Fxios()
      return fxios[method]('/get/:name/edit/:id', {
        param: { name: 'superwf', id: '33' },
      }).then((res: any) => {
        expect(res).toBeInstanceOf(Response)
        return res.text().then((d: any) => {
          expect(d).toEqual(JSON.stringify(mockData.get))
        })
      })
    })

    it(`fxios.${method}方法已与fxios绑定，可以不被fxios调用单独执行，效果不变`, () => {
      const getWithRouterParam = '/get/superwf/edit/33'
      ;(<fetchMockMethod>fetchMock[method])(getWithRouterParam, mockData.get)
      const fxios = new Fxios()
      const request = fxios[method]
      return request('/get/:name/edit/:id', {
        param: { name: 'superwf', id: '33' },
      }).then(res => {
        expect(res).toBeInstanceOf(Response)
        return res.text().then((d: any) => {
          expect(d).toEqual(JSON.stringify(mockData.get))
        })
      })
    })

    it(`${method}方法，测试路由函数，param可为空值`, () => {
      ;(<fetchMockMethod>fetchMock[method])(mockUrls.get, mockData.get)
      const fxios = new Fxios()
      return fxios[method](mockUrls.get).then(res => {
        expect(res).toBeInstanceOf(Response)
        return res.text().then((d: any) => {
          expect(d).toEqual(JSON.stringify(mockData.get))
        })
      })
    })

    it(`${method}方法，测试url baseURL`, () => {
      const withBase = '/api/get'
      ;(<fetchMockMethod>fetchMock[method])(withBase, mockData.get)
      const fxios = new Fxios({ baseURL: '/api' })
      return fxios[method]('/get').then(res => {
        expect(res).toBeInstanceOf(Response)
      })
    })

    it(`${method}方法，测试res.text()`, () => {
      const fxios = new Fxios()
      ;(<fetchMockMethod>fetchMock[method])(mockUrls.get, mockData.get)
      return fxios[method](mockUrls.get).then(res => {
        expect(res).toBeInstanceOf(Response)
        return res.text().then((d: any) => {
          expect(d).toEqual(JSON.stringify(mockData.get))
        })
      })
    })

    if (method !== 'get') {
      it(`${method}方法，测试定制headers，与提交对象是自动添加的json header`, () => {
        const headers = {
          'X-Request': 'power',
        }
        const fxios = new Fxios({ headers })
        ;(<fetchMockMethod>fetchMock[method])(mockUrls.get, mockData.get)
        const data = { name: 'abc' }
        return fxios[method](mockUrls.get, { body: data }).then(res => {
          const lastRequest = fetchMock.lastCall()!.request!
          expect(lastRequest.headers.get('x-request')).toBe('power')
          expect(lastRequest.headers.get('content-type')).toEqual(jsonType)
          expect(res).toBeInstanceOf(Response)
        })
      })

      it(`${method}方法，测试默认requestConfig.redirect`, () => {
        const fxios = new Fxios()
        ;(<fetchMockMethod>fetchMock[method])(mockUrls.get, mockData.get)
        return fxios[method](mockUrls.get).then(res => {
          const lastRequest = fetchMock.lastCall()!.request!
          expect(lastRequest.redirect).toBe(defaultRequestConfig.redirect)
          expect(res).toBeInstanceOf(Response)
        })
      })

      it(`${method}方法，测试runtimeConfig`, () => {
        const fxios = new Fxios()
        ;(<fetchMockMethod>fetchMock[method])(mockUrls.get, mockData.get)
        return fxios[method](mockUrls.get, undefined, {
          redirect: 'error',
        }).then((res: any) => {
          const lastRequest = fetchMock.lastCall()!.request!
          expect(lastRequest.redirect).toBe('error')
          expect(res).toBeInstanceOf(Response)
        })
      })
    }
  })

  it('get方法，测试interceptor.request', () => {
    const query = { abc: 'xyz' }
    const fxios = new Fxios()
    fxios.interceptor.request = (url, option, runtimeConfig) => {
      const u = parse(url, true)
      u.query.name = 'def'
      delete url.search
      const u1 = format(url)
      return [u1, option, runtimeConfig]
    }
    const url = format({
      pathname: mockUrls.get,
      query: { abc: 'xyz', name: 'def' },
    })
    fetchMock.get(url, mockData.get)
    return fxios.get(url, { query }).then(res => {
      expect(fetchMock.lastCall!()![0]).toBe('/get?abc=xyz&name=def')
      expect(res).toBeInstanceOf(Response)
    })
  })

  it('get方法，通过interceptor处理数据', () => {
    const fxios = new Fxios()
    fetchMock.get(mockUrls.get, mockData.get)
    class FError extends Error {
      response: Response
      request: Request
    }
    fxios.interceptor.response = (res, req) => {
      if (!res.ok) {
        const error = new FError(res.statusText)
        error.response = res
        error.request = req
        throw error
      }
      return res.json().then((data: any) => {
        return data
      })
    }
    return fxios.get(mockUrls.get).then(res => {
      expect(res).toEqual(mockData.get)
    })
  })

  it('post方法，测试post object', async () => {
    const data = { name: '123' }
    const fxios = new Fxios()
    fetchMock.post(mockUrls.post, mockData.post)
    await fxios.post(mockUrls.post, { body: data })
    let lastPost = fetchMock.lastCall()!.request!
    expect(lastPost.body).toBe(JSON.stringify(data))
    await fxios.post(mockUrls.post, { body: Object.create(null) })
    lastPost = fetchMock.lastCall()!.request!
    expect(lastPost.body).toBe(JSON.stringify({}))
  })

  it('post方法，测试post string', () => {
    const data = 'abcdefaesdf'
    const fxios = new Fxios()
    fetchMock.post(mockUrls.post, mockData.post)
    return fxios.post(mockUrls.post, { body: data }).then(res => {
      const lastPost = fetchMock.lastCall()!.request!
      expect(lastPost.body).toBe(data)
    })
  })

  it('post方法，测试post Buffer', () => {
    const data = Buffer.alloc(8)
    const fxios = new Fxios()
    fetchMock.post(mockUrls.post, mockData.post)
    return fxios.post(mockUrls.post, { body: data }).then(res => {
      const lastPost = fetchMock.lastCall()!.request!
      expect(lastPost.body).toBe(data)
    })
  })

  it('interceptor.catch', done => {
    const fxios = new Fxios()
    fxios.interceptor.catch = (err, req) => {
      expect(err).toBeInstanceOf(Error)
      expect(req).toBeInstanceOf(Request)
      done()
    }
    fxios.interceptor.response = (res, req) => {
      if (res.status !== 200) {
        throw new Error(res.status)
      }
    }
    const init = { status: 404 }
    const res = new Response(undefined, init)
    fetchMock.get(mockUrls.get, res)
    fxios.get(mockUrls.get)
  })

  it('当没有interceptor.catch时，通过普通catch可以捕获错误', done => {
    const fxios = new Fxios()
    fxios.interceptor.response = (res, req) => {
      if (res.status !== 200) {
        throw new Error(res.status)
      }
    }
    const init = { status: 404 }
    const res = new Response(undefined, init)
    fetchMock.get(mockUrls.get, res)
    fxios.get(mockUrls.get).catch(err => {
      expect(err).toBeInstanceOf(Error)
      done()
    })
  })

  it(`测试runtimeConfig更改baseURL`, () => {
    const fxios = new Fxios({
      baseURL: '/api/',
    })
    fetchMock.get('/xxx/abc', mockData.get)
    return fxios
      .get('abc', undefined, {
        baseURL: '/xxx/',
      })
      .then((res: any) => {
        expect(res).toBeInstanceOf(Response)
      })
  })

  it('测试query中有数组的情况', () => {
    const fxios = new Fxios({
      baseURL: '/api/',
    })
    fetchMock.get('/api/abc?type=a&type=b', mockData.get)
    return fxios
      .get('abc', {
        query: {
          type: ['a', 'b'],
        },
      })
      .then(res => {
        expect(res).toBeInstanceOf(Response)
      })
  })

  it('测试url参数param中有乱码字符', () => {
    const fxios = new Fxios({
      baseURL: '/api/',
    })
    fetchMock.get(
      '/api/%25EF%25BF%25BD%25EF%25BF%25BDt%25E7%259C%259F%25E5%25AE%259E18ww',
      mockData.get,
    )
    return fxios
      .get(':name', {
        param: {
          name: '��t真实18ww',
        },
      })
      .then(res => {
        expect(res).toBeInstanceOf(Response)
      })
  })

  it('interceptor.request的runtimeConfig中包含请求的method', () => {
    const fxios = new Fxios()
    fxios.interceptor.request = (url, option, runtimeConfig) => {
      expect((runtimeConfig as FxiosConfig).method).toBe('GET')
      return [url, option, runtimeConfig]
    }
    const url = mockUrls.get
    fetchMock.get(url, mockData.get)
    return fxios.get(url).then(res => {
      expect(fetchMock.lastCall!()![0]).toBe('/get')
      expect(res).toBeInstanceOf(Response)
    })
  })

  describe('测试自定义http方法', () => {
    it('扩展trace方法', async () => {
      const fxios = new Fxios({})
      expect('trace' in fxios).toBe(false)
      fxios.extendHttpMethod('trace')
      expect('trace' in fxios).toBe(true)

      const url = '/xxx/abc'
      fetchMock.mock(url, 200)
      await fxios.trace(url)
      const lastPost = fetchMock.lastCall()!.request!
      expect(lastPost.method).toBe('TRACE')
    })
  })
})
