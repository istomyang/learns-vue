// noinspection SpellCheckingInspection
import { isArray, parseStringWithVal, isFunction, isString, isNode } from './'

const handlePrototype = (source: object) => {
  !Object.getPrototypeOf(source) &&
    Object.setPrototypeOf(source, Object.prototype)
}

/**
 * Get Value from Object deeply
 * @param o general object, like {a:{b:{c:'c'}}}
 * @param path e.g. 'a.b.c'
 * @return if null, return null
 */
export const getDeepVal = (o: object, path: string): any | null => {
  let pathList
  if (typeof path === 'string') {
    pathList = path.split('.')
  } else {
    pathList = path
  }

  const len = pathList.length

  let _result = o
  try {
    for (let i = 0; i < len; i++) {
      _result = _result[pathList.shift()]
    }
  } catch (e) {
    _result = null
  }
  if (_result === undefined || '' + _result === '' + NaN) _result = null
  return _result
}

/**
 * Set Value from Object deeply
 * @param o general object, like {a:{b:{c:'c'}}}
 * @param path e.g. 'a.b.c'
 * @param val Value
 */
export const setDeepVal = (o: object, path: string, val: any) => {
  let pathToKey = path.split('.')
  let count = pathToKey.length - 1
  let i = 0
  let _mid = o

  for (; i < count; i++) {
    const k = pathToKey[i]
    if (!_mid[k]) {
      _mid[k] = {}
    }
    _mid = _mid[k]
  }

  _mid[pathToKey[i]] = val
}

/**
 *
 * @param o Object Type
 * @param path like 'a.b.c.d' or ['a','b', Symbol('1'), 'c']
 */
export const has = (o: object, path: string | any[]) => {
  let pathList
  if (typeof path === 'string') {
    pathList = path.split('.')
  } else {
    pathList = path
  }

  const len = pathList.length
  let _tmp: object = o
  let i = -1

  while (++i < len) {
    const k = pathList[i]
    const r = _tmp.hasOwnProperty(k)
    if (!r) return false
    _tmp = _tmp[k]
  }

  return true
}

export const isObject = (o: object | any[] | any) => {
  if (typeof o !== 'object') return false
  if (o === null) return false
  if (Array.isArray(o)) return false
  return o!.constructor.name === 'Object'
}

const setForObject = (o: object, k: string, value: any) => {
  Object.defineProperty(o, k, {
    value,
    // 若没有，则命令行端口无法遍历到此属性
    enumerable: true,
    writable: true,
    configurable: true,
  })
}

/**
 * Merge source to target, covering strategy
 * @param source
 * @param target
 * @returns None, Operate directly
 */
export const merge = (source: object, target: object) => {
  // prevent modify key from Object.prototype
  const kList = Object.getOwnPropertyNames(source)

  for (const k of kList) {
    let type = typeof source[k]
    if (type === 'object') {
      merge(source[k], target[k])
    }
    if (type === 'string' || Array.isArray(k) || type === 'number') {
      target[k] = source[k]
    }
  }
}

export const checkData = (checkList: Array<string>, checkdata: object) =>
  Object.keys(checkdata).every(o => checkList.some(a => a === o))

/**
 * Mix update object in target object, override strategy.
 * @param source
 * @param target
 * @param update flag to update only, ignore new data item.
 * @return target is result and return is target
 * Noto: Can't update array, it will be replaced directly.
 * */
export const mixin = (source: object, target: object, update = false) => {
  if (!source && !target) throw new Error('mixin: no source or target')
  // handlePrototype(source)
  for (let p in source) {
    // another way to prevent modify Object.prototype
    if (source.hasOwnProperty(p)) {
      if (typeof target[p] === 'object') {
        mixin(source[p], target[p], update)
        continue
      }

      if (update && !target[p]) continue

      target[p] = source[p]
    }
  }
  return target
}

/**
 * Generate a object schema through a string code, like:
 * 'a,b,c.d,.e,.f.g,..h.s,.j.r,.k.l.m,n.o.p,..t,..u.v,.w,x,y'
 * */
export const genObjectSchema = (code: string, print: boolean = false) => {
  const list = code.split(',')
  let pre = []
  let children = []

  // 对每个item进行补全
  for (let p of list) {
    const preDot = (p.match(/(?<!\w)\./g) || []).length
    // const postDot = (p.match(/(?<=\w)\./g) || []).length
    let vals = p.match(/\w+/g)

    if (preDot > 0) {
      const a = pre.splice(0, preDot)
      vals = [...a, ...vals]
    }

    /**
     * 问题描述：
     * 此作用域下的vals和下面children打印出来的是不一样的，
     * 不一样的地方是，...a 没有了，而 ...a 操作 类似于 a.concat()，
     * 然后解决方法是：children.push([...vals])，或者 a = [...pre].splice(0, preDot)
     * 很显然，这是一个有关指针的问题，但是我没有弄明白，并且当我简化问题的代码时，问题并没有复现。
     *
     * pre持有上一个引用,后被splice修改
     */
    pre = vals.concat()
    children.push(vals)
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

  _result.forEach(r => mixin(r, result))

  return result
}

/**
 * Filter object by filtercode, which holds original object's figure
 * */
export const filterObject = (source: object, filtercode: string) => {
  const target = genObjectSchema(filtercode)

  return mixin(source, target, true)
}

export const emptyObject = () => Object.create(null)

export enum Direction {
  asc,
  desc,
}

export const quickSort = (
  o: object[],
  key: string,
  direction: Direction,
  parse: (val: any) => any
) => {
  const v = (l: object[], k: number) => parse(l[k][key])
  const set = (l: object[], i: number, v: any) => (l[i] = v)
  const get = (l: object[], i: number) => l[i]

  const exchange = (l: object[], i: number, j: number) => {
    let _mid = get(l, i)
    set(l, i, get(l, j))
    set(l, j, _mid)
    return l
  }

  const partition = (l: object[], p: number, r: number) => {
    // set one element
    let _pivot = v(l, r)
    let i = p - 1
    for (let j = p; j <= r - 1; j++) {
      // i represent max index of val smaller than _pivot
      if (direction === Direction.asc && v(l, j) <= _pivot) {
        // add now j to smaller group
        i++
        exchange(l, i, j)
      }

      if (direction === Direction.desc && v(l, j) >= _pivot) {
        // add now j to smaller group
        i++
        exchange(l, i, j)
      }
    }
    // insert _pivot between smaller and larger
    exchange(l, ++i, r)
    // return index of _pivot
    return ++i
  }

  const _q = (l: object[], p: number, r: number) => {
    if (p < r) {
      let i = partition(l, p, r)
      _q(l, p, --i)
      _q(l, ++i, r)
    }
  }

  _q(o, 0, o.length - 1)

  return o
}

interface restType {
  path: string
  fc: string
}

interface handleType {
  path: string
  handle: (val: any) => any
}

/**
 * Pick data from source to schema figure
 *
 * @param source souce object
 * @param variable variable is a shared var to complete string path
 * {
 *  $0: 'a.b', // a.b. is error
 *  $ok: 'a.b.d',
 *  $aaaaaaa: 'a.r.d'
 * }
 * @param schema The figure you want to get
 * e.g.
 * {
 *   a: ()=>[path:string, val:any => any] // handle
 *   b: {
 *      c: 'a.b.c' // path
 *      d: ['a.b','a.b.c','c.d.r'] // aggregation
 *      e: '$ok.c.d.$0' // path must absolute, so use variable
 *      f: ()=>[path:'$0', val => val] // variable in everywhere
 *   }
 * }
 * */
export const pick = (source: object, schema: object, variable?: object) => {
  const re_$ = /\$\w+(?=\.)?/g // has test
  const parse = (path: string) => parseStringWithVal(path, re_$, variable)
  const isF = isFunction
  const getVal = getDeepVal
  const target = Object.assign({}, schema)

  const visit = (target: object) => {
    for (const [k, v] of Object.entries(target)) {
      if (isF(v)) {
        const [_path, handler] = (v as Function).call(null)
        const path = parse(_path)
        const result = getVal(source, path)
        target[k] = (handler as Function).call(null, result)
        continue
      }

      if (isString(v)) {
        const path = parse(v)
        target[k] = getVal(source, path)
        continue
      }

      if (isArray(v)) {
        target[k] = v.map(path => {
          path = parse(path)
          return getVal(source, path)
        })
        continue
      }

      if (isObject(v)) {
        visit(v)
        continue
      }

      target[k] = `Error:k is ${k},v is ${v}`
    }
  }

  visit(target)

  return target
}

/**
 * Pick data from source to schema figure
 * @deprecated
 * @param source souce object
 * @param variable variable is a shared var to complete string path
 * {
 *  $0: 'a.b',
 *  $ok: 'a.b.d',
 *  $aaaaaaa: 'a.r.d'
 * }
 * @param schema The figure you want to get
 * {
 *  a: { path: '$0.a.b', handle: val => val + 1 } // with handle
 *  b: {
 *    c: 'a.b.d' // path must absolute, string, or array
 *    d: ['b.d.f','$ok.a.b','v.g.s'] // you can provide more location to find by key 'd'
 *    e: {
 *      n: '=a.b' // '=' means aasign value directly, equals b.e.n === a.b
 *      _rest: {path: 'a.b.c', fc: 'a,s,f,g'} // path must assign a object
 *    }
 *  }
 * }
 *
 */
export const pick2 = (source: object, schema: object, variable?: object) => {
  const re_val = /\$\w+(?=\.)?/g
  const re_de = /^=/g
  const re_assign = /^=\w/
  const convert = (str: string) =>
    str.replace(re_val, match => (variable ? variable[match] : ''))
  const de = (str: string) => str.replace(re_de, '')

  const hasHandle = (o: object) => {
    const a = o.hasOwnProperty('path')
    const b = o.hasOwnProperty('handle')
    return a && b
  }

  const getValWithPaths = (o: object, path: string | string[]) => {
    let path_list = []
    if (typeof path === 'string') {
      path_list.push(path)
    } else {
      path_list = path
    }

    const real_path = path_list.find(path => !!getDeepVal(o, path))

    return getDeepVal(o, real_path)
  }

  const loop = (schema: object, target: object) => {
    for (const [k, v] of Object.entries(schema)) {
      if (k === '_rest') {
        let path = convert((v as restType).path)
        const fc = v!.fc
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
        let path = convert((v as handleType).path)
        const handle = v!.handle
        let result

        if (re_assign.test(path)) {
          path = de(path)
          result = handle(getValWithPaths(source, path))
        } else {
          result = handle(getValWithPaths(source, path + `.${k}`))
        }

        setForObject(target, k, result)
        continue
      }

      if (typeof v === 'string') {
        let path = convert(v as string)
        let result
        if (re_assign.test(path)) {
          path = de(path)
          result = getValWithPaths(source, path)
        } else {
          result = getValWithPaths(source, path + `.${k}`)
        }
        setForObject(target, k, result)
        continue
      }

      if (isArray(v)) {
        let paths = (v as string[]).map(path => convert(path as string))
        const result = getValWithPaths(source, paths)
        setForObject(target, k, result)
        continue
      }

      if (isObject(v)) {
        setForObject(target, k, loop(v, {}))
      }
    }
  }

  let target = {}
  loop(schema, target)
  return target
}

/**
 * Update object data from a fragment of updating object
 *
 * Array and Object has strategy, generally, we can review old data, do something
 * modify, and at last, we may add some new data. Well, these are optionally.
 * you can use this structure: {_s:true [1] ,review:(item)=>{},data:[]||{}} [2]
 *
 * [1] Tell me this is a strategy
 * [2] Handle function signature: Array.map's hf, (k,v) => [newK,newV]
 * */
// export const updateObject = (source: any, update: any) => {
//   for (const p in update) {
//     const uP = update[p]
//     const sP = source[p]
//     const has = !!sP
//     const isStrategy = has && (isArray(sP) || isObject(sP)) && !!uP._s
//     const isA = isArray(sP)
//
//     if (!has || !isStrategy) source[p] = uP
//
//     if (isA) {
//       const reviewHandle = uP.review
//       const data = uP.data || []
//
//       const reviewResult =
//         (reviewHandle && (sP as any[]).map(reviewHandle)) || []
//
//       source[p] = [...reviewResult, ...data]
//     } else {
//       const reviewHandle = uP.review
//       const data = uP.data || {}
//       const reviewResult = {}
//
//       for (const [k, v] of Object.entries(sP)) {
//         const [newK, newV] = (reviewHandle && reviewHandle(k, v)) || []
//         if (!newK && !newV) continue
//         reviewResult[newK] = newV
//       }
//
//       source[p] = { ...reviewResult, ...data }
//     }
//
//     //  嵌套
//   }
// }
