import fxios, {
  HttpMethod,
  Fxios,
  jsonType,
  IFxiosRequestOption,
  isPlainObject,
} from '../index'
import { format } from 'url'
// import fetchMock = require('fetch-mock')
import { GlobalWithFetchMock } from 'jest-fetch-mock'

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock
customGlobal.fetch = require('jest-fetch-mock')
customGlobal.fetchMock = customGlobal.fetch

const mockData = {
  get: { code: 'success', message: 'ok', data: { id: 1 } },
}

const mockUrls = {
  get: '/get',
  post: '/post',
  withPathParameter: '/menber/:id',
}

const httpMethods: HttpMethod[] = [
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'head',
  'options',
]

// type fetchMockMethod = typeof fetchMock.post

describe('fetch', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
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

  describe('Proxy http request methods', () => {
    httpMethods.forEach(method => {
      it(`test http request method: ${method} by Proxy`, async () => {
        const f = new Fxios()
        fetchMock.mockResponseOnce(JSON.stringify(mockData.get))
        const a = await f[method]({
          url: mockUrls.get,
        })
        // console.log(fetchMock.mock.calls)
        expect(await a.json()).toEqual(mockData.get)
      })
    })
  })

  it('default export instance', () => {
    expect(fxios).toBeInstanceOf(Fxios)
  })

  it('test path parameter', async () => {
    const f = new Fxios()
    fetchMock.mockResponseOnce(JSON.stringify(mockData.get))
    await f.get({
      url: mockUrls.withPathParameter,
      path: {
        id: '123',
      },
    })
    expect(fetchMock).toHaveBeenCalledWith(
      mockUrls.withPathParameter.replace(':id', '123'),
      { method: 'get' },
    )
  })

  it('test query parameter', async () => {
    const f = new Fxios()
    fetchMock.mockResponseOnce(JSON.stringify(mockData.get))

    const query = {
      id: '123',
      name: 'def',
    }
    await f.get({
      url: mockUrls.get,
      query,
    })
    expect(fetchMock).toHaveBeenCalledWith(mockUrls.get + format({ query }), {
      method: 'get',
    })
  })

  it('test body parameter', async () => {
    const f = new Fxios()
    fetchMock.mockResponseOnce(JSON.stringify(mockData.get))

    const body = {
      id: '123',
      name: 'def',
    }
    await f.post({
      url: mockUrls.post,
      body,
    })
    expect(fetchMock).toHaveBeenCalledWith(mockUrls.post, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': jsonType,
      },
    })
  })

  it('test formData parameter', async () => {
    const f = new Fxios()
    fetchMock.mockResponseOnce(JSON.stringify(mockData.get))

    const formData = {
      id: '123',
      name: 'def',
    }
    await f.post({
      url: mockUrls.post,
      formData,
    })

    const form = new FormData()
    form.append('id', formData.id)
    form.append('name', formData.name)
    expect(fetchMock.mock.calls[0]).toEqual([
      '/post',
      {
        method: 'post',
        body: form,
      },
    ])
  })

  it('test formData use FormData instance parameter', async () => {
    const f = new Fxios()
    fetchMock.mockResponseOnce(JSON.stringify(mockData.get))

    const form = new FormData()
    form.append('id', '123')
    form.append('name', 'def')

    await f.post({
      url: mockUrls.post,
      formData: form,
    })

    expect(fetchMock.mock.calls[0]).toEqual([
      '/post',
      {
        method: 'post',
        body: form,
      },
    ])
  })

  it('test factory method create', () => {
    expect(Fxios.create()).toBeInstanceOf(Fxios)
    expect(fxios.create()).toBeInstanceOf(Fxios)
  })

  it('default instance has no requestOption', () => {
    expect(fxios.requestOption).toBe(undefined)
  })

  it('instance option', async () => {
    const f = new Fxios({
      baseURL: '/abc',
      credentials: 'same-origin',
    })
    expect(f.baseURL).toEqual('/abc')
    expect(f.requestOption).toEqual({
      credentials: 'same-origin',
    })

    fetchMock.mockResponse(JSON.stringify(mockData.get))
    await f.get({ url: '/def' })
    expect(fetchMock).toHaveBeenLastCalledWith('/abc/def', {
      method: 'get',
      credentials: 'same-origin',
    })

    f.baseURL = '/xxx'
    await f.get({ url: '/def' })
    expect(fetchMock).toHaveBeenLastCalledWith('/xxx/def', {
      method: 'get',
      credentials: 'same-origin',
    })
  })

  it('no config baseURL, instance baseURL is blank string', () => {
    const f = new Fxios()
    expect(f.baseURL).toBe('')

    const f1 = Fxios.create()
    expect(f1.baseURL).toBe('')

    const f2 = f.create({
      headers: {
        'CSRF-TOKEN': 'xxxxx',
      },
    })
    expect(f2.baseURL).toBe('')
    expect(f2.requestOption.headers).toEqual({
      'CSRF-TOKEN': 'xxxxx',
    })
  })

  describe('interceptor', () => {
    it('request interceptor modify query and baseURL', async () => {
      const f = new Fxios({
        baseURL: '/abc',
      })
      const query = { ddd: '122' }
      f.interceptor.request = (option: IFxiosRequestOption) => {
        option.baseURL = '/def'
        option.query = query
        return option
      }
      fetchMock.mockResponse(JSON.stringify(mockData.get))

      await f.get({ url: '/xxx' })
      expect(fetchMock).toHaveBeenLastCalledWith(
        '/def/xxx' + format({ query }),
        {
          method: 'get',
        },
      )
    })

    it('response interceptor', async () => {
      const f = new Fxios({
        baseURL: '/abc',
      })
      f.interceptor.response = (res: Response) => {
        return res.json()
      }
      fetchMock.mockResponseOnce(JSON.stringify(mockData.get))

      const a = await f.get()
      expect(a).toEqual(mockData.get)
    })

    it('catch interceptor', async () => {
      const f = new Fxios({
        baseURL: '/abc',
      })
      f.interceptor.catch = (err: Error) => {
        return err
      }

      const error = new Error('test error')
      fetchMock.mockRejectedValue(error)

      const e = await f.get()
      expect(e).toEqual(error)
    })

    it('when no catch interceptor, just throw', async () => {
      const f = new Fxios({
        baseURL: '/abc',
      })

      const error = new Error('test error')
      fetchMock.mockRejectedValue(error)

      try {
        await f.get()
      } catch (e) {
        expect(e).toEqual(error)
      }
    })
  })

  it('when no request method, use GET for default', async () => {
    const f = Fxios.create()
    fetchMock.mockResponseOnce(JSON.stringify(mockData.get))
    await f.request({
      url: '/aaa',
    })
    expect(fetchMock).toHaveBeenLastCalledWith('/aaa', {
      method: 'get',
    })
  })
})
