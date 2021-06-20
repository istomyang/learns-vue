<template>
  <component
    :is="component"
    @click.capture="handleClick"
    class="b"
    :class="{
      disabled: disabled,
    }"
    v-bind="$attrs"
  >
    <LIcon :icon="icon" class="big icon" />
  </component>
</template>

<script>
import LIcon from '../../Shared/Icon'

export default {
  inheritAttrs: false,
  props: {
    // icon
    icon: {
      type: String,
      default: null,
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
  },
  computed: {
    // 主要实现打开链接和正常的div
    component() {
      if (this.$attrs.href) {
        return 'a'
      } else {
        return 'div'
      }
    },
  },
  components: { LIcon },

  methods: {
    handleClick(evt) {
      if (this.disabled) {
        // 阻止默认行为，比如a跳转，复选框选中，按键按下去是否有效
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault
        evt.preventDefault()
        // 阻止进一步传播
        evt.stopPropagation()
        // 停止click事件监听处理器数组的继续执行
        ect.stopImmediatePropagation()
      } else {
        this.$emit('click', this.name)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.b
  border none
  background-color transparent
  border-radius 50%
  padding 0
  margin 5px
  outline none
  &:hover
    box-shadow 0px 0px 0px 10px #c9395e1a
    background-color #c9395e1a
</style>