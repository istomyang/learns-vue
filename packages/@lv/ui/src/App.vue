<template>
  <div id="ui" :class="textScale">
    <router-view />
  </div>
</template>

<script>
import Icon from './components/Shared/Icon'

export default {
  name: 'App',
  metaInfo: {
    title: 'home',
    titleTemplate: 'lv-%s',
  },
  computed: {
    textScale() {
      return this.$store.state.text_scale
    },
  },
  components: { Icon },
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
      'switch_locale',
      localStorage.getItem('ls-vues:locale') || 'zh'
    )
    this.$store.dispatch(
      'switch_low_animation',
      localStorage.getItem('ls-vues:lowanimation') || 'false'
    )
  },
}
</script>

<style lang="stylus">
// 设置竖向满屏
// 需要最起码html100%
html, body, #ui
  height 100%
  overflow hidden
  padding 0
  margin 0
  user-select none

html
  background-color #030303

// 便于使用 em 单位
#ui
  font-size 10px
  &.small
    font-size 8px
  &.normal
    font-size 10px
  &.big
    font-size 14px
  &.large
    font-size 16px
</style>
