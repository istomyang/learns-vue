import { delay } from '@lv/shared/common'

export class A {
  a: number
  static async init() {
    const aa = new A()
    try {
      await delay
      aa.a = 3
      return aa
    } catch (error) {}
  }
}


