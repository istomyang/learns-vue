const _isObject = (o) => Object.prototype.toString.call(o) === '[object Object]'

exports.isPlainObject = (o) => {
  let constructor, prototype
  if (!_isObject(o)) return false
  constructor = o.constructor
  if (constructor === undefined) return true
  prototype = constructor.prototype
  if (!_isObject(prototype)) return false
  if (!prototype.hasOwnProperty('isPrototypeOf')) return false
  return true
}

// 函数仅运行一次
exports.runOnce = (fn) => {
  const f = () => {
    if (!!f.called) return f.value
    f.called = true
    return (f.value = fn.apply(this, arguments))
  }
  f.called = false
  return f
}

exports.onceStrict = (fn) => {
  var f = function () {
    if (f.called) throw new Error(f.onceError)
    f.called = true
    return (f.value = fn.apply(this, arguments))
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}
