import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './locales'

// https://kazupon.github.io/vue-i18n/zh/
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages,
})

export default i18n
