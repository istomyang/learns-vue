// webpack在解析此模块的时候, 必须把 svg 变成 html文本, 才能注入.
// 所以我选择: svg-inline-loader, raw-lodaer也行

const icons = require.context('../../../node_modules/material-design-icons/sprites/svg-sprite', true, /svg-sprite-(\w+)-symbol\.svg$/)

// 作为插件安装到Vue
export default {
  install (Vue) {
    const iconsWrapper = document.createElement('div')
    iconsWrapper.style.display = 'none'
    // Load all the SVG symbols
    icons.keys().forEach(key => {
      const result = icons(key)
      iconsWrapper.innerHTML += result
    })
    document.body.insertBefore(iconsWrapper, document.body.firstChild)
  },
}
