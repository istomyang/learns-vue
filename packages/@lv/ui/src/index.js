import './plugins'

import Vue from 'vue'
import App from './App.vue'

import i18n from './i18n'

import RM from './router'
import SM from './store'

import { install as github_install } from '@lv/ui-gallery-addon-github'

Vue.config.productionTip = false

let vueConfig = {
  i18n,
  render: h => h(App),
}

github_install(Vue, vueConfig, RM, SM)

vueConfig['router'] = RM.generate()
vueConfig['store'] = SM.generate()

const vm = new Vue(vueConfig).$mount('#ui')

// 处理窗口尺寸改变
const handleWindowSize = function () {
  vm.$store.dispatch('watch_win_width', window.innerWidth).then(r => {})
}
handleWindowSize()
window.onresize = handleWindowSize
