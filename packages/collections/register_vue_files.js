// 根据路径，导入有所模块
// https://www.webpackjs.com/guides/dependency-management/#require-context
// https://vuejs.bootcss.com/guide/components-registration.html#%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6%E7%9A%84%E8%87%AA%E5%8A%A8%E5%8C%96%E5%85%A8%E5%B1%80%E6%B3%A8%E5%86%8C
const register_vue_files = (path, Vue) => {
  const files = require.context(path, true, /[a-zA-Z0-9]+\.(jsx?|vue)$/i)
  const nameReg = /([a-zA-Z0-9]+)\./i
  files.keys().forEach((f) => {
    // 必须default，否则无效，理由？可以打印看看，只有default有效
    Vue.component(f.match(nameReg)[1], files(f).default || files(f))
    // console.log(coms(f))
  })
}

;['component', 'page'].forEach((dict) => register_vue_files(`./${dict}`))
