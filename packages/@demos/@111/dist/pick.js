'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.pick = void 0
const filterObject = (source, filtercode) => {
  const mixin = (source, target) => {
    for (let p in source) {
      if (typeof target[p] === 'object') {
        mixin(source[p], target[p])
      }
      if (typeof source[p] === 'string' || !target[p]) {
        target[p] = source[p]
      }
    }
    return target
  }
  const filter = (source, target) => {
    for (let p in source) {
      if (typeof target[p] === 'object') {
        mixin(source[p], target[p])
      }
      if (typeof target[p] === 'string') {
        target[p] = source[p]
      }
    }
    return target
  }
  const gen = w => {
    const o = () => Object.create(null)
    const list = w.split(',')
    let pre
    let children = []
    for (let p of list) {
      const preDot = (p.match(/(?<!\w)\./g) || []).length
      const postDot = (p.match(/(?<=\w)\./g) || []).length
      let vals = p.match(/\w/g)
      if (preDot > 0) {
        const a = pre.splice(0, preDot)
        vals = [...a, ...vals]
        pre = vals.concat()
      } else {
        pre = vals.concat()
      }
      children.push([...vals])
    }
    let _result = []
    for (let c of children) {
      let _r = {}
      let _mid
      let l = c.length
      for (let i = l - 1; i >= 0; i--) {
        let a = c[i]
        if (i === l - 1) {
          _r[a] = a
          continue
        }
        _mid = _r
        _r = {}
        _r[a] = _mid
      }
      _result.push(_r)
    }
    let result = {}
    _result.forEach(_r => mixin(_r, result))
    return result
  }
  const target = gen(filtercode)
  return filter(source, target)
}
const getDeepVal = (o, path) => {
  let pathList
  if (typeof path === 'string') {
    pathList = path.split('.')
  } else {
    pathList = path
  }
  const len = pathList.length
  let _result = o
  for (let i = 0; i < len; i++) {
    _result = _result[pathList.shift()]
    if (_result === undefined) break
  }
  return _result
}
const isObject = o => {
  if (typeof o !== 'object') return false
  if (Array.isArray(o)) return false
  if (o.constructor.name !== 'Object') return false
  return true
}
const isArray = o => {
  if (Array.isArray(o)) return true
  return false
}
const pick = (source, schema, variable) => {
  const re_val = /\$\w+(?=\.)?/g
  const re_de = /^\=/g
  const re_assign = /^\={1}\w/
  const convert = str =>
    str.replace(re_val, match => (variable ? variable[match] : ''))
  const de = str => str.replace(re_de, '')
  const hasHandle = o => {
    const a = o.hasOwnProperty('path')
    const b = o.hasOwnProperty('handle')
    return a && b
  }
  const getValWithPaths = (o, path) => {
    let path_list = []
    if (typeof path === 'string') {
      path_list.push(path)
    } else {
      path_list = path
    }
    const real_path = path_list.find(path => !!getDeepVal(o, path))
    return getDeepVal(o, real_path)
  }
  const loop = (schema, target) => {
    for (const [k, v] of Object.entries(schema)) {
      if (k === '_rest') {
        let path = convert(v.path)
        const fc = v.fc
        let o
        if (re_assign.test(path)) {
          path = de(path)
          o = getValWithPaths(source, path)
        } else {
          o = getValWithPaths(source, path + `.${k}`)
        }
        const result = filterObject(o, fc)
        Object.assign(target, result)
        continue
      }
      if (isObject(v) && hasHandle(v)) {
        let path = convert(v.path)
        const handle = v.handle
        let result
        if (re_assign.test(path)) {
          path = de(path)
          result = handle(getValWithPaths(source, path))
        } else {
          result = handle(getValWithPaths(source, path + `.${k}`))
        }
        target[k] = result
        continue
      }
      if (typeof v === 'string') {
        let path = convert(v)
        let result
        if (re_assign.test(path)) {
          path = de(path)
          result = getValWithPaths(source, path)
        } else {
          result = getValWithPaths(source, path + `.${k}`)
        }
        target[k] = result
        continue
      }
      if (isArray(v)) {
        let paths = v.map(path => convert(path))
        const result = getValWithPaths(source, paths)
        Object.defineProperty(target, k, { value: result })
        continue
      }
      if (isObject(v)) {
        Object.defineProperty(target, k, { value: loop(v, {}) })
        continue
      }
    }
  }
  let target = {}
  loop(schema, target)
  return target
}
exports.pick = pick
const source = {
  a: {
    b: {
      c: 1,
      d: 'sdsds',
    },
  },
}
const schema = {
  a: {
    path: '=a.b.c',
    handle: val => val + 10,
  },
  d: 'a.b',
}
const d = exports.pick(source, schema)
console.log(d)
//# sourceMappingURL=pick.js.map
