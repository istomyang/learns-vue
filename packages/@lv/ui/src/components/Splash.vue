<template>
  <div
    class="splash"
    @click="switching"
    :class="{
      expanded: expanded,
      nodesktop: !isDesktop,
    }"
  >
    <img alt="Vue logo" src="../assets/logo.png" class="logo" />
    <div class="title">{{ $t('public.app_name') }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      expanded: false,
    }
  },
  methods: {
    switching() {
      this.expanded = !this.expanded
    },
  },
  computed: {
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
  },
}
</script>

<style lang="stylus" scoped>
.splash
  background-color #030303
  color #ffffff
  display flex
  align-items center
  justify-content center
  transition all 0.5s ease
  flex-direction row
  height 150px
  & > .title
    color #ffffff
    font-size $fz-splash-title
    font-family $ff-splash-title
  & > .logo
    margin 10px
    width 34px
  &.nodesktop
    display none
  &.expanded
    flex-direction column
    // 高度确定,可以是百分比
    height 80%
  &.expanded > .logo
    width 72px
</style>
