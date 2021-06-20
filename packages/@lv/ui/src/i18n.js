import Vue from 'vue'
import VueI18n from 'vue-i18n'

// https://kazupon.github.io/vue-i18n/zh/
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  messages: {
    zh: {
      public: {
        app_name: '学习系列：Vue',
        back: '返回',
      },
    },
    en: {
      public: {
        app_name: 'Learns Vue',
        back: 'Back',
      },
    },
  },
})

console.log('i18n.js', i18n.messages.zh.public)

export default i18n
