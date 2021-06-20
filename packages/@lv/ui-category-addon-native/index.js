import icon from './icon.png'

const category = {
  id: 'native',
  category_name: {
    zh: 'Web原生基本功',
    en: 'Web Native',
  },
  category_icon: icon,
  category_demos: {},
}
const componentFiles = {}
let key = 0

const files = require.context('./src', true, /\.(vue|jsx?)$/i)
files.keys().forEach(file => {
  const _file = file.split('/')
  const len = _file.length
  // meta用来标识访问相应数据
  const meta = {
    // preview们
    filename: _file[len - 1].replace(/\.\w+$/, ''),
    ext: _file[len - 1].replace(/\w+\./, ''),
    // 一个demo
    group: _file[len - 2],
  }

  // 获取的文件是data.js
  if (meta.filename === 'data' && meta.ext === 'js') {
    const data = files(file).default
    category.category_demos[meta.group] = data
  }

  // 获取的文件是preview.vue
  if (meta.ext === 'vue') {
    // 注册
    const componentName = `${category.id}-${meta.group}-${meta.filename}`
    const componentRoot = files(file)
    componentFiles[meta.filename] = {
      name: componentName,
      component: componentRoot.default || componentRoot,
    }

    const _a = category.category_demos[meta.group]

    // 添加到数据
    if (!_a.options) {
      _a.options = []
    }
    _a.options.push({
      key: ++key,
      id: meta.filename,
      name: componentRoot.default.meta.option_title,
    })

    if (!_a.previews) {
      _a.previews = {}
    }
    _a.previews[meta.filename] = {
      id: meta.filename,
      title: componentRoot.default.meta.preview_title,
      componentName,
    }
  }
})

// vue文件字符串化
let code_string_all
const codes = require.context('!!raw-loader!./src', true, /\.(vue)$/i)
codes.keys().forEach(file => {
  const _file = file.split('/')
  const len = _file.length
  const meta = {
    filename: _file[len - 1].replace(/\.\w+$/, ''),
    ext: _file[len - 1].replace(/\w+\./, ''),
    group: _file[len - 2],
  }

  let _a = category.category_demos[meta.group]

  const code_string = codes(file).default

  if (!_a.codes) {
    _a.codes = {}
  }

  _a.codes[meta.filename] = {
    html: code_string.match(/\<template\>[\s\S]*\<\/template\>/i),
    js: code_string.match(/\<script\>[\s\S]*\<\/script\>/i),
    ts: code_string.match(/\<script lang\=\"ts\"\>[\s\S]*\<\/script\>/i),
    css: code_string.match(/\<style scoped\>[\s\S]*\<\/style\>/i),
    stylus: code_string.match(
      /\<style lang\=\"stylus\" scoped\>[\s\S]*\<\/style\>/i
    ),
  }
})

export function install(Vue, options = {}) {
  // 注册
  Object.values(componentFiles).forEach(f => {
    Vue.component(f.name, f.component)
  })
}

export default {
  ...category,
  install,
}
