import icon from './icon.png'

const category = {
  id: 'product',
  category_name: {
    zh: '产品需求',
    en: 'Product',
  },
  category_icon: icon,
  category_demos: {},
}
const componentFiles = {}
let key = 0

const vueList = []
const jsList = []

const files = require.context('./src', true, /\.(vue|js)$/i)
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
    data: null,
  }

  if (meta.ext === 'vue') {
    const componentRoot = files(file)
    const component = componentRoot.default || componentRoot

    meta.data = {
      name: `${category.id}-${meta.group}-${meta.filename}`,
      component,
    }

    vueList.push(meta)
  }

  if (meta.filename === 'data' && meta.ext === 'js') {
    const data = files(file).default
    meta.data = data
    jsList.push(meta)
  }
})

for (let i = 0; i < jsList.length; i++) {
  const meta = jsList[i]
  category.category_demos[meta.group] = meta.data
}

for (let i = 0; i < vueList.length; i++) {
  const meta = vueList[i]
  componentFiles[meta.filename] = meta.data

  const _a = category.category_demos[meta.group]

  // 添加到数据
  if (!_a.options) {
    _a.options = []
  }
  _a.options.push({
    key: ++key,
    id: meta.filename,
    name: meta.data.component.meta.option_title,
  })

  if (!_a.previewsId) {
    _a.previewsId = []
  }
  _a.previewsId.push(meta.filename)

  if (!_a.previews) {
    _a.previews = {}
  }
  _a.previews[meta.filename] = {
    id: meta.filename,
    title: meta.data.component.meta.preview_title,
    componentName: meta.data.name,
  }
}

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
  install,
  ...category,
}
