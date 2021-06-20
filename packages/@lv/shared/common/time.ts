// 便于编译器优化，若是const，会导致缓存实效。
export const getNowDateISO = () => new Date().toISOString()
export const getNowDateMs = () => new Date().getTime()

/**
 * Check source is expired
 * @param updateTime ms from 1970-1-1 00:00:00 UTC or string of ISO format
 * @returns
 */
export const isExpired = (updateTime: number | string) => {
  let time
  if (typeof updateTime === 'number') {
    time = updateTime
  } else {
    time = new Date(updateTime).getTime()
  }

  // ms
  const interval = 1000 * 60 * 60 * 24 * 7

  return time + interval < getNowDateMs()
}

// noinspection SpellCheckingInspection
/**
 * Timer is used to data management, like LRU
 * */
export class Timer {
  /**
   * Use it to attach flag
   * */
  static getUpdate() {
    return new Date()
  }

  /**
   * Expired validation
   * @param {Date} dateTime
   * @param {Number} interval One unit is one day.
   * */
  static isExpired(dateTime: Date, interval: number): boolean {
    const ms = interval * 24 * 60 * 60 * 1000
    const nowDate = Timer.getUpdate()
    // @ts-ignore
    return nowDate - dateTime > ms
  }
  /**
   * Expired validation
   * @param {Date} dateTime
   * @param {Number} interval One unit is one day.
   * */
  static isExpiredString(dateTime: string, interval: number): boolean {
    const ms = interval * 24 * 60 * 60 * 1000
    const ago = new Date(dateTime)
    const nowDate = Timer.getUpdate()
    // @ts-ignore
    return nowDate - ago > ms
  }

  /**
   * A than B
   * if A > B, A is latest, return 1
   * if A = B, return 0
   * if A < B, B is latest, return -1
   * */
  static athanb(a: Date, b: Date) {
    // @ts-ignore
    return a - b > 0 ? 1 : a - b === 0 ? 0 : -1
  }

  /**
   * Sort: default, the latest at behind
   * Sort can modify original array
   * */
  static sort(dates: Date[], reverse = false) {
    dates.sort(Timer.athanb)
    if (reverse) dates.reverse()
  }

  static isEqual(a: Date, b: Date) {
    // @ts-ignore
    return a - b === 0
  }
}
