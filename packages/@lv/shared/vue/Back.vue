<template>
  <div class="back" @click="click">
    <Icon class="icon" icon="arrow_back" />
    <div class="text">{{ $t('back') }}</div>
  </div>
</template>

<script>
import Icon from './Icon'
export default {
  props: ['to'],
  methods: {
    click() {
      this.$router.replace(this.to)
    },
  },
  components: { Icon },
}
</script>

<style lang="stylus" scoped>
height = 45px

.back
  position fixed
  z-index 999
  left 10px
  bottom 10px
  height height
  width 100px
  background-color rgba(169, 223, 191, 0.8)
  border-radius 20px
  display flex
  flex-direction row
  justify-content center
  align-items center
  &:hover
    background-color rgba(212, 239, 223, 0.9)
  > .text
    flex 0 0 auto
    font-family $ff-general
    font-size 2em
    font-weight normal
    color rgba(3, 3, 3, 0.8)
  > .icon
    flex 0 0 auto
    margin-right 5px
    height 26px
    width @height
    > svg
      fill rgba(3, 3, 3, 0.8)
</style>

<i18n>
{
  "zh": {
    "back": "返回"
  },
  "en": {
    "back": "Back"
  }
}

</i18n>
