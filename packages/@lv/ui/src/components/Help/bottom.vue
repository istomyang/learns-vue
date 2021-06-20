<template>
  <div class="b" :class="[isDesktop ? 'desktop' : 'nodesktop']">
    <Icon :icon="icon" class="ic big" />
    <span class="content">
      <slot>default value</slot>
    </span>
  </div>
</template>

<script>
import Icon from '../Shared/Icon'
import { mapGetters } from 'vuex'

export default {
  props: ['icon'],
  components: { Icon },
  computed: {
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
  },
}
</script>

<style lang="stylus" scoped>
.b
  display flex
  flex-direction row
  user-select none
  cursor pointer
  > .content
    font-family $ff-general
    font-weight 300

.b.desktop
  padding 5px 10px
  justify-content center
  align-items center
  border-radius 3px
  &:hover
    background-color #dde2e2
  > .icon
    margin-right 5px
  > .ic >>> svg
    fill #8c8a96
  > .content
    font-size 1.6em

.b.nodesktop
  align-items flex-start
  padding 10px 20px
  margin 5px 0px
  &:hover
    background-color #f0f1f1
  > .icon
    margin-right 15px
  > .ic >>> svg
    fill #96929e
  > .content
    font-size 1.4em
</style>