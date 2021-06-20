/**
 * Push env variable to process.env
 * @param {*} arro [{},{},{}] || {}
 */
export const pushToEnv = arro => {
  const push = o => {
    for ([k, v] of Object.entries(o)) {
      process.env[k] = v.toString()
    }
  }

  const isO = arro.constructor.name === 'Object'
  const isA = arro.constructor.name === 'Array'

  if (isO) push(arro)
  if (isA) arro.forEach(push)
}
