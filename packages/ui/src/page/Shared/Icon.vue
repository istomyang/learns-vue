<script>
export default {
  name: 'Icon',

  functional: true,

  props: {
    icon: {
      type: String,
      required: true,
    },
  },

  render(h, { props, data }) {
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

<style lang="stylus">
.icon
  display inline-block
  width 16px
  height @width
  vertical-align bottom
  svg
    width 100%
    height 100%
    fill pink
    pointer-events none
  &.small
    width 12px
    height @width
  &.medium
    width 18px
    height @width
  &.big
    width 24px
    height @width
  &.large
    width 32px
    height @width
  &.huge
    width 42px
    height @width
  &.gigantic
    width 64px
    height @width
</style>
