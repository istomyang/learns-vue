/**
 * @deprecated This async constructor is invalid
 */
export class AsyncConstructor {
  private then

  constructor(asyncFn) {
    const init = (async () => {
      await asyncFn()
      delete this.then
      return this
    })()

    this.then = init.then.bind(init)
  }
}

/**
 * Use runAsyncAll
 * @deprecated af1 is no-async function, then have get result when af1().
 * All promise fns run concurrently
 * @param fns af1(),af2(),af3(), you don't need putting into a array
 * */
export const PromiseConcurrent = async (...fns) => {
  try {
    const promises = fns.map(fn =>
      fn.catch(e => {
        throw e
      })
    )
    return await Promise.all(promises)
  } catch (err) {
    throw err
  }
}

export const delay = async (ms: number) =>
  await new Promise(resolve => setTimeout(resolve, ms))

/**
 * @deprecated Use runAsyncArray with better stable.
 *
 * When you have a list and launch together
 *
 * @param arr you list
 * @param handle async function
 * @param r if return things?
 * @param serial Run serially
 * @return {} If you wanna to modify external variable by no-serial and no-return, you must
 * must return sth., e.g. `return true` in your handle function, If not, JS
 * compiler will skip await function to go on, and then return null.
 * */
export const AsyncWithArray = async (
  arr: any[],
  handle: (k: any) => any,
  r: boolean = false,
  serial: boolean = false
) => {
  try {
    const justRun = async (arr: any[]) => {
      try {
        if (serial) {
          for (const ar of arr) {
            await handle(ar)
          }
        } else {
          // For V8, use forEach means there's no relative with next code, and
          // can't track result.
          await Promise.all(arr.map(await handle))
          // ;[1, 2].forEach(async i => i)
          // const r = []
          // for (const ar of arr.map(await handle)) {
          //   r.push(await ar)
          // }
          // return r
        }
      } catch (e) {
        throw e
      }
    }

    const returnVal = async (arr: any[]): Promise<any[]> => {
      try {
        let result = []
        if (serial) {
          for (const ar of arr) {
            result.push(await handle(ar))
          }
        } else {
          for (const r of arr.map(await handle)) {
            result.push(await r)
          }
        }
        return result
      } catch (e) {
        throw e
      }
    }

    if (r) {
      return await returnVal(arr)
    } else {
      await justRun(arr)
    }
  } catch (e) {
    throw e
  }
}

/**
 * Run as Promise concurrently whatever has-async or no-async
 * @example
 * const w1 = async () => await delay(10).then(() => 0) // you should run
 * const w2 = () => 1 // wrapper function
 * const w3 = i => new Promise(res => { res(2) }) // support Promise
 * [0, 1, 2] === await runAsyncAll(w1(), w2, w3(2))
 * */
export const runAsyncAll = async (...wrappers) => {
  const re = /(async|promise|then)/i
  const genPromise = wrapper =>
    Promise.resolve()
      .then(wrapper)
      .catch(e => {
        throw e
      })

  const promises = []

  wrappers.forEach(wrapper => {
    promises.push(re.test(wrapper.toString()) ? wrapper : genPromise(wrapper))
  })

  return await Promise.all(promises)
}

/**
 * Test: Just with General function
 *
 * @param wrappers A wrapper function like ()=> Your code and return you result
 * */
export const runAsyncAllTest = async (...wrappers) => {
  const genPromise = wrapper =>
    delay(10)
      .then(wrapper)
      .catch(e => {
        throw e
      })

  const promises = wrappers.map(wrapper => genPromise(wrapper))
  return await Promise.all(promises)
}

/**
 * Run async function with array
 * @param array your array
 * @param af async function, if you want to return sth, then return.
 * @param serial if you want to run one by one
 * @param log if true, throw is write down and code is going on, if false,
 * throw new Error directly
 * @return Param log means whether write result(success or failed) into return,
 * if has-return, return data directly, if no-return, return status object like:
 * {status:'fulfilled',body:''} or {status:'rejected',body: Error}, if log and rejected,
 * always return rejected object.
 * */
export const runAsyncArray = async (
  array: any[],
  af: (ar: any) => any,
  serial: boolean = false,
  log: boolean = false
): Promise<any[] | void> => {
  const runSerially = async () => {
    const result = []
    for (const ar of array) {
      result.push(
        await af(ar)
          .then(
            val =>
              val || {
                status: 'fulfilled',
                body: '',
              }
          )
          .catch(e => {
            if (log) {
              return {
                status: 'rejected',
                body: e,
              }
            } else {
              throw e
            }
          })
      )
    }
    return result
  }
  const runConcurrent = async () => {
    const promises = array.map(ar =>
      af(ar)
        .then(
          val =>
            val || {
              status: 'fulfilled',
              body: '',
            }
        )
        .catch(e => {
          if (log) {
            return {
              status: 'rejected',
              body: e,
            }
          } else {
            throw e
          }
        })
    )
    return await Promise.all(promises)
  }

  try {
    return serial ? await runSerially() : await runConcurrent()
  } catch (e) {
    throw e
  }
}
