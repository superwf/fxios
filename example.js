import Fetch from './index'

export const config = {
  method: 'get',
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
}

const fetch = Fetch(config)

const useThen = res => {
  if (!res.ok) {
    const error = new Error(res.statusText)
    error.response = res
    throw error
  }
  return res.json().then(data => {
    if (data.code === 'success') {
      fetch.emit('success', res)
      return data
    } else {
      const error = new Error(data.message)
      error.code = data.code
      error.response = res
      throw error
    }
  })
}

fetch.useThen(useThen)

const useCatch = error => {
  // 若emitter没有监听函数直接emit一个error，会抛出错误不执行下面的throw error
  if (fetch.emitter.listeners('error').length > 0) {
    fetch.emit('error', error)
  }
}
fetch.useCatch(useCatch)

export default fetch
