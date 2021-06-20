import { getDeepVal } from './object'

export const findObjectFromArray = (
  array: Array<object>,
  key: string,
  value: string | number
) => array.find(ele => ele[key] === value)

// type Predicate<T> = (element: T, index: number, array: T[]) => boolean
// type Find<T> = (collections: T[], path: string, predicate: Predicate<T>) => any

/**
 * Find object in object[] with predicate
 * TODO: findAll, findOnce, findLast ...
 * @param collections object[]
 * @param path 'a.b.c'
 * @param predicate
 */
export const find = (
  collections: any[],
  path: string,
  predicate: (...args) => any
): any => {
  const data = collections.find(predicate)
  return getDeepVal(data, path)
}

export const isArray = (o: any[] | object | any) => !!Array.isArray(o)

/**
 * Generate a array for async
 * @param start from, include
 * @param end end, include
 * @return like [0,1,2,3,4,5,6,7,8,9]
 * */
export const genArrayForAsync = (
  start: number = 0,
  end: number = 9
): number[] => {
  let i = start
  const result = []

  for (; i <= end; i++) {
    result.push(i)
  }

  return result
}
