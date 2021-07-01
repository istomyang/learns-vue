import default_example from './default'
import product from '@lv/ui-category-addon-product'

let key = 0

const categories = []
const infos = {}

const example = Object.values(default_example)

;[product, ...example].forEach(category => {
  // 列表，无需查询
  let category_demos = []
  // 后期需要查询，使用map对象
  let demo_info = {}

  Object.values(category.category_demos).forEach(demo => {
    category_demos.push({
      key: ++key,
      id: demo.id,
      name: demo.demo_name,
      summary: demo.demo_summary,
      icon: demo.demo_icon,
      previewsId: demo.previewsId,
    })

    // 处理info界面的数据
    demo_info[demo.id] = {
      note: {
        title: demo.note_title,
        description: demo.note_description,
      },
      ref: demo.ref,
      options: demo.options,
      previews: demo.previews,
      codes: demo.codes,
    }
  })

  categories.push({
    key: ++key,
    id: category.id,
    name: category.category_name,
    icon: category.category_icon,
    demos: category_demos,
  })

  infos[category.id] = demo_info
})

console.log('处理后的数据', { categories, infos })

export { categories, infos }
