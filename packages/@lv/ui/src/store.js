import Vue from 'vue'
import Vuex from 'vuex'

// https://vuex.vuejs.org/zh/
Vue.use(Vuex)

const text_scale = {
  small: 'small',
  normal: 'normal',
  big: 'big',
  large: 'large',
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

// noinspection JSUnresolvedVariable
const testExample = {
  name: 'm_test',
  namespaced: true,
  state: {
    testState: 1,
  },
  getters: {
    getTestState1(state) {},
    getTestState2(state) {},
  },
  mutations: {
    mutateTestState(state, value) {},
  },
  actions: {
    actionTestState({ commit }, value) {},
  },
}

class StateManagement {
  constructor(config) {
    this.config = config
    if (!config.modules) this.config['modules'] = {}
  }

  addModule(module) {
    const name = module.name
    delete module.name
    this.config.modules[name] = module
  }

  merge(name, namespaced, ...mod) {
    const result = {
      name,
      namespaced,
      getters: {},
      mutations: {},
      actions: {},
      modules: {},
    }

    // TODO: need test
    mod.forEach(m => {
      ;['state', 'getters', 'mutations', 'actions'].forEach(p => {
        for (const i in m[p]) {
          result[p][i] = m[p][i]
        }
      })
    })

    return result
  }

  generate() {
    return new Vuex.Store(this.config)
  }
}

export default new StateManagement({
  state: {
    text_scale: text_scale.normal,
    locale: locale.zh,
    theme: theme.light,
    low_animation: false,
    window_width: 0,
    // demo部分，预览的页面控制
    current_demo_preview: 'preview1',
    // 当前的展示的demo,格式： category_id/demo_id
    current_category_demo: '',
  },
  getters: {
    getIsDesktop(state) {
      return state.window_width >= 800
    },
    getCategoryId(state) {
      return state.current_category_demo.split('/')[0]
    },
    getDemoId(state) {
      return state.current_category_demo.split('/')[1]
    },
  },
  // 只能同步
  mutations: {
    SWITCH_THEME(state, value) {
      state.theme = value
      localStorage.setItem('ls-vues:theme', value)
      const el = document.getElementById('ui')
      if (value !== 'light') {
        el.classList.add('dark-theme')
      } else {
        el.classList.remove('dark-theme')
      }
    },
    SWITCH_TEXT_SCALE(state, value) {
      if (state.text_scale !== value) {
        state.text_scale = value
        localStorage.setItem('ls-vues:textscale', value)
      }
    },
    SWITCH_LOCALE(state, value) {
      if (state.locale !== value) {
        state.locale = value
        localStorage.setItem('ls-vues:locale', value)
      }
    },

    SWITCH_LOW_ANIMATION(state, value) {
      // localStorage值以字符串形式存储
      // 初始化使用字符串，设置使用boolean
      let normalizedVal
      if (typeof value === 'boolean') {
        normalizedVal = value
      } else {
        normalizedVal = value === 'true'
      }

      if (state.low_animation !== normalizedVal) {
        state.low_animation = normalizedVal
        localStorage.setItem('ls-vues:lowanimation', value)

        const el = document.getElementById('ui')
        if (normalizedVal) {
          el.classList.add('low-animation')
        } else {
          el.classList.remove('low-animation')
        }
      }
    },
    WATCH_WIN_WIDTH(state, w) {
      if (typeof w === 'number') state.window_width = w
    },
    SWITCH_PREVIEW(state, name) {
      state.current_demo_preview = name
    },
    CHANGE_CATEGORY_DEMO(state, current) {
      state.current_category_demo = current
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
    switch_low_animation({ commit }, value) {
      commit('SWITCH_LOW_ANIMATION', value)
    },
    watch_win_width({ commit }, w) {
      commit('WATCH_WIN_WIDTH', w)
    },
    switch_preview({ commit }, name) {
      commit('SWITCH_PREVIEW', name)
    },
    change_current_category_demo({ commit }, val) {
      commit('CHANGE_CATEGORY_DEMO', val)
    },
  },
})
