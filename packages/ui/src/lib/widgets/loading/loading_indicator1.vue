<script>
/**
  加载图标
  需要考虑的点:
  1. 自定义颜色
  2. 宽度
  3. 主题
  4. 覆盖层
  参考: https://vuejs.github.io/ui/#/demo/loading
 */

export default {
  name: 'loading_indicator_1',
  functional: true,
  props: {
    /* 2.3.0以上版本,所有作用组件的attr都被自动解析为props */
  },
  // https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6
  render(h, context) {
    const { data, children } = context

    return (
      <div class="loading-indicator" {...data}>
        <div class="animation" />
        {children}
      </div>
    )
  },
}
</script>

<style lang="stylus" scoped>
// 选择颜色
chooseColor($color)
  // https://stylus.bootcss.com/docs/bifs.html#rgbacolor--rgba
  border-color rgba($color, 0.1)
  // 关键技术: 一端有颜色,其余没有, 然后转起来.
  border-right-color $color

$light-color = #42b983
$dark-color = #ea6e00

.loading-indicator
  display flex
  &.inline
    // inline outside and flex inside
    display inline-flex
  flex-direction column
  align-items center
  justify-content center
  > .animation
    // 转圈圈
    animation rotating 0.7s linear infinite
    width 16px
    height @width
    border-radius 50%
    border transparent 2px solid
    // 选择颜色
    colors($light-color)
    // 暗色模式之下或者高对比度下
    .dark-mode &
      colors($dark-color)
  // 根据场景需求定义按钮
  &.accent
    > .animation
      colors(green)
  // 根据尺寸定义按钮
  &.big
    > .animation
      width 24px
      height @width
      border-width 3px
  // 定制覆盖当前页的loading
  &.overlay
    position absolute
    top 0
    left 0
    bottom 0
    right 0
    z-index 1
    > .animation
      // 与按钮间隔
      margin-bottom 32px
    // 不是全透明的情况
    &:not(.transparent)
      //颜色可以自定义
      background rgba(white, 0.95)
      .dark-mode &
      background rgba(green, .95)
    // 不随滚动
    &.fixed
      position fixed

@keyframes rotating {
  0%
    transform rotate(0)
  100%
    transform rotate(360deg)
}
</style>