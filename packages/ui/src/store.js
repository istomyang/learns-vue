import Vue from 'vue'
import Vuex from 'vuex'

// https://vuex.vuejs.org/zh/
Vue.use(Vuex)

const text_scale = {
  small: 'small',
  normal: 'normal',
  big: 'big',
  superbig: 'superbig',
}

const locale = {
  zh: 'zh',
  en: 'en',
}

const theme = {
  light: 'light',
  dark: 'dark',
}

export const opts = {
  text_scale: text_scale,
  locale: locale,
  theme: theme,
}

// 设置拦截
const _checkSet = (state, object, name, key) => {
  if (object === null) return false
  if (
    Object.keys(object).some(el => el === key) &&
    state.name !== object[key]
  ) {
    state.name = object[key]
    return true
  }
  return false
}

export default new Vuex.Store({
  state: {
    text_scale: text_scale.normal,
    locale: locale.zh,
    theme: theme.light,
    low_animation_factor: 1.0,
    window_width: 0,
  },
  getters: {
    getIsDesktop(state) {
      return state.window_width >= 800
    },
  },
  // 只能同步
  mutations: {
    SWITCH_THEME(state, value) {
      state.theme = value
      localStorage.setItem('ls-vues:theme', value)
      const el = document.getElementsByTagName('html')[0]
      if (value !== 'light') {
        el.classList.add('dark-theme')
      } else {
        el.classList.remove('dark-theme')
      }
    },
    SWITCH_TEXT_SCALE(state, value) {
      _checkSet(state, text_scale, 'text_scale', value)
      localStorage.setItem('ls-vues:textscale', value)
    },
    SWITCH_LOCALE(state, value) {
      _checkSet(state, locale, 'locale', value)
      localStorage.setItem('ls-vues:locale', value)
    },
    // 夹在 0.5 和 1 两个值
    SWITCH_LOW_FACTOR(state, value) {
      value = parseFloat(value)
      if (typeof value !== 'number') return
      if (value <= 0 || (value > 0 && value < 1))
        state.low_animation_factor = 0.5
      if (value >= 1) state.low_animation_factor = 1.0
      localStorage.setItem('ls-vues:lowfactor', value)

      const el = document.getElementsByTagName('html')[0]
      if (value !== 1.0) {
        el.classList.add('low-ani')
      } else {
        el.classList.remove('low-ani')
      }
    },
    WATCH_WIN_WIDTH(state, w) {
      if (typeof w === 'number') state.window_width = w
    },
  },
  // 可以异步
  actions: {
    switch_theme({ commit }, value) {
      commit('SWITCH_THEME', value)
    },
    switch_text_scale({ commit }, value) {
      commit('SWITCH_TEXT_SCALE', value)
    },
    switch_locale({ commit }, value) {
      commit('SWITCH_LOCALE', value)
    },
    switch_low_animation_factor({ commit }, value) {
      commit('SWITCH_LOW_FACTOR', value)
    },
    watch_win_width({ commit }, w) {
      commit('WATCH_WIN_WIDTH', w)
    },
  },
})
