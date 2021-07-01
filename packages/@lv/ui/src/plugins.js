import Vue from 'vue'

// import VueUi from '@vue/ui'

// https://github.com/vuejs/ui
// Vue.use(VueUi)

import VueMeta from 'vue-meta'

// 设置HTML的META字段
// https://vue-meta.nuxtjs.org/
Vue.use(VueMeta)

// https://www.npmjs.com/package/vue-toast-notification
import VueToast from 'vue-toast-notification'
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css'

Vue.use(VueToast, {
  position: 'bottom',
})

import Icon from './icon'
Vue.use(Icon)

// categories
import ce from '@lv/ui-category-addon-example'
Vue.use(ce)
import product from '@lv/ui-category-addon-product'
Vue.use(product)
