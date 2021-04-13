const descs = [
  '风急天高猿啸哀，渚清沙白鸟飞回。',
  'Vue.js is an open-source MVVM front end JavaScript framework',
]

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //含最大值，含最小值
}

const gen_example = function (count) {
  let id = 0
  let result = []
  while (count > id) {
    result.push({
      id: ++id,
      title: `Example${id}`,
      desc: descs[getRandomInt(0, 1)],
    })
  }
  return result
}

export const categorys = [
  {
    id: 0,
    name: 'weight',
    demos: [...gen_example(13)],
  },
  {
    id: 1,
    name: 'layout',
    demos: [...gen_example(9)],
  },
  {
    id: 2,
    name: 'lib',
    demos: [...gen_example(9)],
  },
  {
    id: 3,
    name: 'lib',
    demos: [...gen_example(9)],
  },
  {
    id: 4,
    name: 'lib',
    demos: [...gen_example(9)],
  },
]
