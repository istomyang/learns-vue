const { isPlainObject } = require('../../shared/index.js')
const nodeFetch = require('node-fetch')
const { extend } = require('vue/types/umd')
const { stat } = require('node:fs')

class ReqError extends Error {
  constructor(msg, statusCode, options) {
    super(msg)
    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = 'HttpError'
    this.statusCode = statusCode

    // 使用新的头部,然后删除authorization
    const copyWith_headers = Object.assign({}, options.headers)
    if (!!copyWith_headers.authorization) {
      copyWith_headers = Object.assign({}, options.headers, {
        authorization: options.headers.authorization.replace(
          / .*$/,
          ' [REDACTED]'
        ),
      })
    }
    // URL会很长.....
    copyWith_headers.url = copyWith_headers.url
      .replace(/\bclient_secret=\w+/g, 'client_secret=[REDACTED]')
      .replace(/\baccess_token=\w+/g, 'access_token=[REDACTED]')

    this.headers = copyWith_headers || {}
  }
}

const config = {
  method: 'GET',
  baseUrl: 'https://api.github.com',
  headers: {
    accept: 'application/vnd.github.v3+json',
    'user-agent': userAgent,
  },
}

exports.fetchWrapper = (options) => {
  let headers = {}
  let status, url

  // Jsonseries
  if (isPlainObject(options.body) || Array.isArray(options.body)) {
    options.body = JSON.stringify(options.body)
  }

  const fetch = nodeFetch

  return fetch(options.url, {
    method: options.method || 'GET',
    body: options.body || null,
    headers: options.headers || null,
    redirect: options.redirect,
    follow: options.follow || 20,
    timeout: options.timeout || 0,
    compress: options.compress || true,
    size: options.size || 0,
    agent: options.agent || 'node-fetch/1.0',
  })
    .then((res) => {
      url = res.url
      status = res.status

      // 源码,类型: [key, value]
      for (let kv of res.headers) {
        headers[kv[0]] = kv[1]
      }

      // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status

      // 成功处理请求,但无返回内容
      if (status === 204 || status === 205) {
        return
      }

      // HEAD操作会返回200
      if (options.method === 'HEAD') {
        if (status < 400) {
          return
        }
        throw new ReqError(res.statusText, status, {
          headers,
        })
      }

      // 304文档内容没有改变
      if (status === 304) {
        throw new ReqError('Not Modified', status, { headers })
      }

      // 服务器和客户端问题
      if (status >= 400) {
        return res.text().then((msg) => {
          let err = new ReqError(msg, status, { headers })
          try {
            let resBody = JSON.parse(err.message)
            // can get err.resBody
            Object.assign(err, resBody)

            let errors = resBody.errors
            err.message =
              err.message + ':' + errors.map(JSON.stringify).join(', ')
          } catch (e) {}

          throw err
        })
      }

      const contentType = res.headers.get('content-type')
      if (/application\/json/.test(contentType)) {
        return res.json()
      }
      if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
        return res.text()
      }
      return res.arrayBuffer()
    })
    .then((data) => {
      status, url, headers, data
    })
    .catch((err) => {
      if (err instanceof ReqError) {
        throw err
      }
      throw new ReqError(err.message, 500, {
        headers,
      })
    })
}
