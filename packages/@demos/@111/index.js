const { pullAllBy } = require('lodash')

const a = [
  {
    a: 1,
    b: 2,
  },
  {
    a: 2,
    b: 2,
  },
  {
    a: 3,c
    b: 2,
  },
]

pullAllBy(a, [{ a: 1 }], 'a')
console.log(a)

async function bootstrap() {}

bootstrap().catch()
