// noinspection ES6RedundantAwait

import { expect } from 'chai'
import { describe } from 'mocha'
import { performance } from 'perf_hooks'
import { genArrayForAsync } from './array'
import {
  AsyncWithArray,
  delay,
  runAsyncArray,
  runAsyncAll,
  runAsyncAllTest,
} from './async'
import a from '../../../@demos/@111/archive/others/singleton'
import exp = require('constants')

const isOk = () => expect('').to.equal('')
const isNotOk = () => expect('').to.equal('1')

describe('#AsyncWithArray', function () {
  it('together, return', async function () {
    const delays = [5, 1, 3, 6, 7]
    const arr = genArrayForAsync(1, 5)
    const t0 = performance.now()
    const result = await AsyncWithArray(
      arr,
      async i => {
        const delayTime = delays[i]
        await delay(delayTime)
        return i
      },
      true,
      false
    )
    const t1 = performance.now()
    const delta = t1 - t0
    console.log(delta, result)
    expect(delta).to.be.below(10)
  })

  it('together, just run', async function () {
    const delays = [5, 1, 3, 6, 7]
    const arr = genArrayForAsync(1, 5)
    const result = []
    const t0 = performance.now()
    await AsyncWithArray(
      arr,
      async i => {
        const delayTime = delays[i]
        await delay(delayTime)
        result.push(i)
        return true
      },
      false,
      false
    )
    const t1 = performance.now()
    const delta = t1 - t0
    console.log(delta, result)
    expect(delta).to.be.below(20)
  })
  it('serially, return', async function () {
    const delays = [5, 1, 3, 6, 2]
    const arr = genArrayForAsync(1, 5)
    const t0 = performance.now()
    const result = await AsyncWithArray(
      arr,
      async i => {
        const delayTime = delays[i]
        await delay(delayTime)
        return i
      },
      true,
      true
    )
    const t1 = performance.now()
    const delta = t1 - t0
    console.log(delta, result)
    expect(delta).to.be.above(10)
  })

  it('serially, just run', async function () {
    const delays = [5, 1, 3, 6, 2]
    const arr = genArrayForAsync(1, 5)
    const result = []
    const t0 = performance.now()
    await AsyncWithArray(
      arr,
      async i => {
        const delayTime = delays[i]
        await delay(delayTime)
        result.push(i)
      },
      false,
      true
    )
    const t1 = performance.now()
    const delta = t1 - t0
    console.log(delta, result)
    expect(delta).to.be.above(10)
  })

  it('nested', async function () {
    const arr = genArrayForAsync(0, 4)
    const result = []
    const t0 = performance.now()
    await AsyncWithArray(arr, async i => {
      await AsyncWithArray(arr, async i => {
        await delay(10)
        result.push('a')
        return true
      })
      result.push('b')
      return true
    })
    const t1 = performance.now()
    const delta = t1 - t0
    console.log(delta, result)
    expect(delta).to.be.above(10)
  })
})

describe('#runAsyncArray', function () {
  it('no-serial, no-return', async function () {
    const p1 = async i => await Promise.resolve(i)
    const p2 = async i => await Promise.reject(i)

    const array = [1, 2, 3]

    const result = await runAsyncArray(
      array,
      async ar => {
        if (ar === 3) await p2(ar) // result: throw error normal
        await p1(ar)
      },
      false,
      true
    )

    expect(result).to.deep.equal([
      { status: 'fulfilled', body: '' },
      { status: 'fulfilled', body: '' },
      { status: 'fulfilled', body: '' },
    ])
  })

  it('no-serial, has return', async function () {
    const p1 = async i => await Promise.resolve(i)
    const p2 = async i => await Promise.reject(i)

    const array = [10, 20, 30]

    const result = await runAsyncArray(
      array,
      async ar => {
        await delay(ar)
        if (ar === 30) await p2(ar)
        await p1(ar)
        return ar
      },
      false,
      true
    )
    expect(result).to.deep.equal([10, 20, { status: 'rejected', body: 30 }])
  })

  it('serial, has return', async function () {
    const p1 = async i => await Promise.resolve(i)
    const p2 = async i => await Promise.reject(i)

    const array = [30, 20, 10]

    const result = await runAsyncArray(
      array,
      async ar => {
        await delay(ar)
        if (ar === 20) await p2(ar)
        await p1(ar)
        return ar
      },
      false,
      true
    )
    expect(result).to.deep.equal([30, { status: 'rejected', body: 20 }, 10])
  })
})

describe('#runAsyncAll', function () {
  it('general', async function () {
    const w1 = () => 123
    const w2 = () => 456
    const [r1, r2] = await runAsyncAll(w1, w2)
    expect([r1, r2]).to.deep.equal([123, 456])
  })

  it('delay test', async function () {
    const w1 = () => 123
    const w2 = () => 456
    const t0 = performance.now()
    const [r1, r2] = await runAsyncAllTest(w1, w2)
    const t1 = performance.now()
    expect(t1 - t0).to.be.below(15)
    console.log(t1 - t0)
    expect([r1, r2]).to.deep.equal([123, 456])
  })

  it('mix delayed async with general function', async function () {
    const w1 = async i => await delay(10).then(() => i)
    const w2 = i =>
      new Promise(resolve => {
        delay(10).then(val => {
          resolve(1)
        })
      })
    const w3 = () => 2

    const t0 = performance.now()
    const r = await runAsyncAll(w1(0), w2(1), w3)
    const t1 = performance.now()

    expect(t1 - t0).to.be.below(15)
    console.log(t1 - t0)
    expect(r).to.deep.equal([0, 1, 2])
  })
})
