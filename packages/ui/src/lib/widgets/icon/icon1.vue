<script>
// 使用 material-design-icons
const icons = require.context(
  '../node_modules/material-design-icons/sprites/svg-sprite',
  true,
  /svg-sprite-(\w+)-symbol\.svg$/
)
// 导入到HTML中
const iconsWrapper = document.createElement('div')
iconsWrapper.style.display = 'none'
icons.keys().forEach((k) => {
  const result = icons(k)
  iconsWrapper.innerHTML += result
})
document.body.insertBefore(iconsWrapper, document.body.firstChild)

export default {
  name: 'icon1',
  functional: true,
  props: {
    // 来自 https://github.com/google/material-design-icons
    icon: {
      type: String,
      required: true,
    },
  },

  render(h, context) {
    const { props, data } = context
    return (
      <div class="icon" {...data}>
        <svg>
          <use xlinkHref={`#ic_${props.icon}_24px`} />
        </svg>
      </div>
    )
  },
}
</script>

<style lang="stylus" scoped>
$custom-color = #89deb7

.icon
  display inline-block
  width 16px
  height @width
  fill $custom-color
  pointer-events none
  // 暗色模式
  .dark-mode &
    fill balck
  // 根据场景
  &.success
    svg
      fill $vue-ui-primary-500
  &.danger
    svg
      fill $vue-ui-danger-500
  &.warning
    svg
      fill $vue-ui-warning-500
  // 根据位置
  &.top
    position relative
    top -0.06rem
  // 根据尺寸
  &.small
    width 12px
    height @width
  &.big
    width 24px
    height @width
</style>