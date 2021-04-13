import fetch from 'node-fetch'

export default class BaseController {
  constructor() {}

  async fetch(url = '', data = {}, type = 'GET', resType = 'JSON') {
    type = type.toUpperCase()
    resType = resType.toUpperCase()

    // 拼接字符串
    if (type === 'GET') {
      // http://hostname?a=1&b=2&c=3
      let dataStr = ''
      for (let [k, v] of Object.entries(data)) {
        dataStr += `${k}=${v}&`
      }

      // 去掉末尾&
      if (dataStr !== '') {
        dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
        url = `${url}?${dataStr}`
      }
    }

    // JSON字段
    // https://www.npmjs.com/package/node-fetch#fetchurl-options
    let options = {
      method: type,
      headers: {
        Accept: 'application/json',
      },
    }

    // POST加入body
    if (type === 'POST') {
      Object.defineProperty(options, 'body', {
        value: JSON.stringify(data),
      })
    }

    let resJson
    try {
      const res = await fetch(url, options)
      if (resType === 'TEXT') {
        resJson = await res.text()
      } else {
        resJson = await res.json()
      }
    } catch (err) {
      console.log('Error: Get http data Failed!', err)
      throw new Error(err)
    }

    return resJson
  }
}
