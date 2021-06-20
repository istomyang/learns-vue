const distribute_all = () => {
  // Math.random() is [0:1), so for uniform distribution，My rule is when twice
  // 0, it's equal to 1.
  const gen = () => Math.random()

  let current = gen()

  if (current === 0) return !!gen() ? current : 1

  return current
}

const distribute_never = () => {
  // Math.random() is [0:1), so for uniform distribution.
  // My rule is when twice is 0, then, play again.
  const gen = () => Math.random()

  let current = gen()

  while (current === 0) {
    current = gen()
  }

  return current
}

const distribute_left = () => Math.random()
const distribute_right = () => -1 * Math.random() + 1

/**
 * Return a number between max and min
 * @param query e.g. [0:4],(3:6],[6,10)
 * @return number string
 */
export const math_between: (query: string) => string = (query: string) => {
  const start_include = /^\[/.test(query)
  const end_include = /\]$/.test(query)
  const start_number = parseFloat(query.match(/(?<=^\[|\()[0-9-\.]+(?=\:)/g)[0])
  const end_number = parseFloat(query.match(/(?<=\:)[0-9-\.]+(?=\]|\)$)/g)[0])
  const s_precision =
    (start_number + '').match(/(?<=\.)[0-9]+/g)?.[0]?.length || 0
  const e_precision =
    (end_number + '').match(/(?<=\.)[0-9]+/g)?.[0]?.length || 0
  const precision = Math.max(s_precision, e_precision)

  let distributeStrategy: () => number

  if (start_include && end_include) distributeStrategy = distribute_all
  if (start_include && !end_include) distributeStrategy = distribute_left
  if (!start_include && end_include) distributeStrategy = distribute_right
  if (!start_include && !end_include) distributeStrategy = distribute_never

  const gen = (min: number, max: number) =>
    min + distributeStrategy() * (max - min)

  let result =
    start_number < end_number
      ? gen(start_number, end_number)
      : gen(end_number, start_number)

  return result.toFixed(precision)
}
