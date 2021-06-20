# JS 语法

## 参数解构

### 数组

- 如果等号的右边不是数组（或者严格地说，不是可遍历的结构，参见《Iterator》一章），那么将会报错

```js
let [a, b, c] = [1, 2, 3]
log(a) // 1

let [foo, [[bar], baz]] = [1, [[2], 3]]

let [, , third] = ['foo', 'bar', 'baz']

let [head, ...tail] = [1, 2, 3, 4]

let [x, y, ...z] = ['a']
log(x) // 'a'
log(y) // undefind
log(z) // []

let [x, y] = [1, 2, 3]
log(x) // 1
log(y) // 2

let [a, [b], d] = [1, [2, 3], 4]
log(a) // 1
log(b) // 2
log(d) // 4

let [x, y, z] = new Set(['a', 'b', 'c'])

// 只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值
function* fibs() {
  let a = 0
  let b = 1
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

let [first, second, third, fourth, fifth, sixth] = fibs()
log(sixth) // 5
```

## 正则表达式

### 字符串替换

```js
// g flag search all and run cb every times
''.replace(/\./g, match => match + 1)
```

> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions

## AAAA

### 函数

#### 返回单例
```js
const f1 = () => {
  let a = 0
  return c => {
    a = c || a
    console.log(a)
  }
}

// f1()(1)
// f1()(false)

const f = f1()
f(1)
f(false)
```
