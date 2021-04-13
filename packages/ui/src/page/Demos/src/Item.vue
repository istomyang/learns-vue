<template>
  <div class="demo">
    <Icon class="icon" icon="face" />
    <div class="content">
      <h2 class="title">{{ title }}</h2>
      <p class="desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script>
import Icon from '../../Shared/Icon'
export default {
  props: ['title', 'desc'],
  components: { Icon },
}
</script>

<style lang="stylus" scoped>
.demo
  height 100px
  display flex
  flex-direction row
  justify-content flex-start
  align-items center
  background-color #ffffff
  &:hover
    background-color #f0f1f1
  & > .icon
    height 32px
    width 32px
    // background-color rgb(121, 123, 207)
    margin 0px 20px
    flex 0 0 auto
    & > svg
      fill red
  & > .content
    flex 1 1 auto
    align-self stretch
    border-bottom 2px solid #e6ebeb
    display flex
    flex-direction column
    justify-content center
    align-items flex-start
    padding-right 10px
  & > .content > .title
    margin 0
    font-size 1.8em
    font-weight 400
    font-family $ff-demo-title
  & > .content > .desc
    margin 0
    font-size 1.4em
    color #8f8c95
    font-family $ff-demo-desc
</style>