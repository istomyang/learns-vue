<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  metaInfo: {
    title: 'App',
    titleTemplate: '%s-Page',
  },
  mounted() {
    this.$store.dispatch(
      'switch_theme',
      localStorage.getItem('ls-vues:theme') || 'light'
    )
    this.$store.dispatch(
      'switch_text_scale',
      localStorage.getItem('ls-vues:textscale') || 'normal'
    )
    this.$store.dispatch(
      'switch_text_scale',
      localStorage.getItem('ls-vues:locale') || 'zh'
    )
    this.$store.dispatch(
      'switch_text_scale',
      localStorage.getItem('ls-vues:lowfactor') || '1.0'
    )
  },
}
</script>

<style lang="stylus">
// 设置竖向满屏
// 需要最起码html100%
html, body, #app
  height 100%
  overflow hidden
  padding 0
  margin 0
  user-select none

html
  background-color #030303

// 便于使用 em 单位
body
  font-size 10px
</style>
