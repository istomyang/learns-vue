<template>
  <div class="b" @click="handleClick" :class="{ selected: selected === id }">
    <div class="title">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: String,
    },
    // 标识符
    id: { type: String },
    first: {},
  },
  methods: {
    handleClick() {
      // 修改vuex的值
      this.$store.dispatch('switch_preview', this.id)
      this.$emit('update:selected', this.id)
    },
  },
}
</script>

<style lang="stylus" scoped>
.b
  flex 0 0 auto
  padding 5px 20px
  margin 0
  &.selected
    background-color #fafbfb
  &:hover
    background-color #f0f1f1

& > .title
  font-family $ff-d-opt
  font-size $fz-d-opt
  font-weight 300
</style>