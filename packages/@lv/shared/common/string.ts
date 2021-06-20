/**
 * If match, but has no variable, then replace with ''
 * */
export const parseStringWithVal = (str: string, re: RegExp, variable: object) =>
  str.replace(re, match => (variable as any).match || '')

export const isString = (str: string) => typeof str === 'string'
