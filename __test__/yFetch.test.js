import fetchMock from 'fetch-mock'
import fetch, { config } from '../example'

const noop = () => {}

const mockData = {
  get: { code: 'success', message: 'ok', data: [] },
  getWithQuery: { code: 'success', message: 'url', data: [] },
  getAndReturnErrorCode: { code: '302', message: 'no access' },
  getAndReturnErrorString: 'sfdasfaewf',
  get401: { status: 401 },
  get302: { status: 302, redirectUrl: '/login' },
  delete: { code: 'success', message: 'delete', data: [] },
  deleteWithQuery: { code: 'success', message: 'deleteWithQuery', data: [] },
  post: { code: 'success', message: 'post', data: [] },
  postWithData: { code: 'success', message: 'postWithData', data: [] },
  postWithQuery: { code: 'success', message: 'postWithQuery', data: [] },
  put: { code: 'success', message: 'put', data: [] },
  putWithData: { code: 'success', message: 'putWithData', data: [] },
  putWithQuery: { code: 'success', message: 'putWithQuery', data: [] },
  upload: { code: 'success', message: 'upload' },
  getWithRuntimeConfig: { code: 'success', message: 'ok' },
}

const query = { abc: 'xyz' }
const data = { name: '123' }
const url = {
  get: '/get',
  getAndReturnErrorCode: '/getAndReturnErrorCode',
  getAndReturnErrorString: '/getAndReturnErrorString',
  getWithQuery: '/get?abc=xyz',
  get401: '/get401',
  get302: '/get302',
  delete: '/delete',
  deleteWithQuery: '/delete?abc=xyz',
  post: '/post',
  postWithData: '/postData',
  postWithQuery: '/post?abc=xyz',
  put: '/put',
  putWithData: '/putData',
  putWithQuery: '/put?abc=xyz',
  upload: '/upload',
  getWithRuntimeConfig: '/getWithRuntimeConfig',
}

describe('fetch', () => {
  afterAll(() => {
    fetchMock.restore()
  })

  describe('test http methods', () => {
    beforeAll(() => {
      fetchMock.get(url.get, mockData.get)
      fetchMock.get(url.getWithQuery, mockData.getWithQuery)
      fetchMock.get(`${url.get}?def=def&abc=xyz`, mockData.getWithQuery)
      fetchMock.delete(url.delete, mockData.delete)
      fetchMock.delete(url.deleteWithQuery, mockData.deleteWithQuery)
      fetchMock.post(url.post, mockData.post)
      fetchMock.post(url.postWithData, mockData.postWithData, {
        body: JSON.stringify(data),
      })
      fetchMock.post(url.postWithQuery, mockData.postWithQuery, {
        body: JSON.stringify(data),
      })
      fetchMock.put(url.put, mockData.put)
      fetchMock.put(url.putWithQuery, mockData.putWithQuery)
      fetchMock.put(url.putWithData, mockData.putWithData, {
        body: JSON.stringify(data),
      })
      fetchMock.post(url.upload, mockData.upload, {
        body: 'xxxxxx',
      })
      fetchMock.get(url.getWithRuntimeConfig, mockData.getWithRuntimeConfig)
    })

    it('fetch', () => {
      return fetch(url.get).then(res => {
        expect(res).toEqual(mockData.get)
      })
    })

    it('fetch.get', () => {
      return fetch.get(url.get).then(res => {
        expect(res).toEqual(mockData.get)
      })
    })

    it('get and receive success event', done => {
      fetch.emitter.once('success', res => {
        expect(res.url).toBe(url.get)
        expect(typeof res.json).toBe('function')
        done()
      })
      fetch.get(url.get)
    })

    it('get with string query', () => {
      return fetch.get(url.get, 'abc=xyz').then(res => {
        expect(res).toEqual(mockData.getWithQuery)
      })
    })

    it('get with object query', () => {
      return fetch.get(url.get, query).then(res => {
        expect(res).toEqual(mockData.getWithQuery)
      })
    })

    it('test get url has query, and fetch with query', () => {
      return fetch.get(`${url.get}?def=def`, query).then(res => {
        expect(res).toEqual(mockData.getWithQuery)
      })
    })

    it('fetch.delete', () => {
      return fetch.delete(url.delete).then(res => {
        expect(res).toEqual(mockData.delete)
      })
    })

    it('delete with query', () => {
      return fetch.delete(url.delete, query).then(res => {
        expect(res).toEqual(mockData.deleteWithQuery)
      })
    })

    it('fetch.post', () => {
      return fetch.post(url.post).then(res => {
        expect(res).toEqual(mockData.post)
      })
    })

    it('post data', () => {
      return fetch.post(url.postWithData, data).then(res => {
        const lastPost = fetchMock.lastCall()[1]
        expect(lastPost.body).toBe(JSON.stringify(data))
        expect(res).toEqual(mockData.postWithData)
      })
    })

    it('post string type data', () => {
      const data = 'zfdsfaewfaw'
      return fetch.post(url.postWithData, data).then(res => {
        const lastPost = fetchMock.lastCall()[1]
        expect(lastPost.body).toBe(data)
        expect(res).toEqual(mockData.postWithData)
      })
    })

    it('post with query', () => {
      return fetch.post(url.postWithQuery, query).then(res => {
        expect(res).toEqual(mockData.postWithQuery)
      })
    })

    it('fetch.put', () => {
      return fetch.put(url.put).then(res => {
        expect(res).toEqual(mockData.put)
      })
    })

    it('put data', () => {
      return fetch.put(url.putWithData).then(res => {
        expect(res).toEqual(mockData.putWithData)
      })
    })

    it('put with query', () => {
      return fetch.put(url.putWithQuery, query).then(res => {
        expect(res).toEqual(mockData.putWithQuery)
      })
    })

    it('upload', () => {
      return fetch.upload(url.upload, 'xxxxxx').then(res => {
        expect(res).toEqual(mockData.upload)
      })
    })

    it('getWithRuntimeConfig', () => {
      const headers = {
        'x-requext': 'powered-by-x',
      }
      return fetch
        .get(
          url.getWithRuntimeConfig,
          {},
          {
            headers,
          },
        )
        .then(res => {
          expect(res).toEqual(mockData.getWithRuntimeConfig)
          const lastRequestConfig = fetchMock.lastCall()[1]
          expect(lastRequestConfig).toEqual({
            ...config,
            method: 'get',
            headers,
          })
        })
    })
  })

  describe('test emitter', () => {
    beforeAll(() => {
      fetchMock.get(url.getAndReturnErrorCode, mockData.getAndReturnErrorCode)
      fetchMock.get(
        url.getAndReturnErrorString,
        mockData.getAndReturnErrorString,
      )
      fetchMock.get(url.get401, mockData.get401)
      fetchMock.get(url.get302, mockData.get302)
    })

    it('has response but code is not success', done => {
      fetch.emitter.once('error', error => {
        expect(error.message).toEqual(mockData.getAndReturnErrorCode.message)
        expect(error.code).toEqual(mockData.getAndReturnErrorCode.code)
        expect(error.response.url).toBe(url.getAndReturnErrorCode)
        done()
      })
      fetch.get(url.getAndReturnErrorCode).catch(noop)
    })

    it('has response but get text not json format', done => {
      fetch.emitter.once('error', error => {
        expect(error.message).toContain('invalid json response body')
        done()
      })
      fetch.get(url.getAndReturnErrorString).catch(noop)
    })

    it('get 401 http code', done => {
      fetch.emitter.once('error', error => {
        expect(error.message).toContain('Unauthorized')
        expect(error.response.url).toBe(url.get401)
        done()
      })
      fetch.get(url.get401).catch(noop)
    })

    it('get 302 http code', done => {
      fetch.emitter.once('error', error => {
        expect(error.message).toContain('Found')
        done()
      })
      fetch.get(url.get302).catch(noop)
    })

    it('catch error', done => {
      fetch.get(url.get401).catch(error => {
        expect(error.request.url).toBe(url.get401)
        done()
      })
    })
  })
})
