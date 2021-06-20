import category from '@lv/ui-category-addon-example'

const CategoryCount = 5
const MinDemosCount = 7
const MaxDemosCount = 15
let JustOneMaxDemos = true

const category_demo = category.category_demos.example1

let categories = {}

for (let i = 0; i < CategoryCount; i++) {
  let _category = category

  // demos
  if (JustOneMaxDemos) {
    _category.category_demos = genDemos(MaxDemosCount)
    JustOneMaxDemos = false
  } else {
    _category.category_demos = genDemos(MinDemosCount)
  }

  // id
  const rawId = category.id
  let id = `${rawId}${i}`
  let newObj = { id }
  _category = concat(newObj, _category)

  categories[id] = _category
  _category = null
}

function genDemos(count) {
  let _demos = {}
  for (let i = 0; i < count; i++) {
    const rawId = category_demo.id
    let id = `${rawId}${i}`
    let newObj = { id }
    _demos[id] = concat(newObj, category_demo)
  }
  return _demos
}

// newObj 仅仅包含覆盖的数据
function concat(newObj, oldObj) {
  let _obj = {}
  for (var k in oldObj) {
    _obj[k] = oldObj[k]
  }
  for (var j in newObj) {
    _obj[j] = newObj[j]
  }
  return _obj
}

console.log('生成的默认数据', categories)

export default { ...categories }
