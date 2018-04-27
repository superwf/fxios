import fetchMock from 'fetch-mock'
import { makeFetch, config } from '../example'

const fetch = makeFetch({
  ...config,
  base: '/base',
})

const mockData = {
  get: { code: 'success', message: 'ok', data: [] },
}

const url = {
  get: '/base/get',
}

describe('fetch', () => {
  afterAll(() => {
    fetchMock.restore()
  })
  beforeAll(() => {
    fetchMock.get(url.get, mockData.get)
  })

  it('fetch', () => {
    return fetch('/get').then(res => {
      expect(res).toEqual(mockData.get)
    })
  })
})
