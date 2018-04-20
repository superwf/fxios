import fetch from '../example'

describe('network error', () => {
  it('the error should contain the request param', done => {
    const url = 'http://xxxxxxxxx.sf99ukzjfjsaf/xxxyyyzzz'
    fetch.emitter.once('error', error => {
      expect(error).toBeInstanceOf(Error)
      expect(error.request.url).toBe(url)
      done()
    })
    fetch.get(url).catch(() => {})
  })
})
