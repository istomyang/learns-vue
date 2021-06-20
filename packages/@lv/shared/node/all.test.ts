import { describe } from 'mocha'
import { expect } from 'chai'
import { print } from './highlight'

const isOk = () => expect(123).to.equal(123)

describe('highlight.js', function () {
  describe('#print', function () {
    it('general', function () {
      print('0123456789', 0)
      print('0123456789', 1)
      print('0123456789', 2)
      print('0123456789', 3)
      isOk()
    })
  })
})
