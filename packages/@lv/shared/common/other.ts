import { getNowDateISO } from './time'
import { isArray } from './array'
import { isObject } from './object'
import { isString } from './string'

// @ts-ignore
export const isNode = !(typeof window !== 'undefined' && window.document)

/**
 * preset:
 * - repos: /\/repos(\/[A-Za-z0-9-_.~]+)+/g
 * */
export const deUrlPrefix = (url: string, preset?: string, re?: RegExp) => {
  // https://api.github.com/repos/vuejs/vue/commits/d257c81a5889d45012f6df39873fba3f8697f0cc
  // -> '/repos/vuejs/vue/commits/d257c81a5889d45012f6df39873fba3f8697f0cc'
  const repos = /\/repos(\/[A-Za-z0-9-_.~]+)+/g
  let r

  if (re) {
    r = re
  } else {
    switch (preset) {
      case 'repo':
        r = repos
        break
      default:
        r = new RegExp('')
        break
    }
  }

  return url.match(r)[0]
}

export enum Flag {
  // 更新资源打上标记
  update,
}

export const injectFlags = (o: any, ...flags: Flag[]) => {
  const mark_new = () => {
    o['update_time'] = getNowDateISO()
  }

  flags.forEach(flag => {
    switch (flag) {
      case Flag.update:
        mark_new()
        break

      default:
        break
    }
  })
}

/**
 * Check any is null in the eye's of data handler
 * */
export const isEmpty = (source: any): boolean => {
  const arrIs = (source: any) =>
    isArray(source) && (source as any[]).length === 0

  return (
    arrIs(source) ||
    (isObject(source) && arrIs(Object.keys(source as object))) ||
    (isString(source) && (source as string) === '')
  )
}
