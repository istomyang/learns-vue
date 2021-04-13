<template>
  <div class="footer" :class="{ nodesktop: !isDesktop }">
    <div class="logo">
      <div class="pre"></div>
      <div class="vue">Learns-Vues</div>
    </div>
    <div class="info">
      <div class="wrapper">
        <B icon="info">{{$t('about')}}</B>
        <B icon="feedback">{{$t('feedback')}}</B>
      </div>
      <p class="designby">{{$t('designby')}}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import B from '../Help/bottom'
export default {
  computed: {
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
  },
  components: { B },
}
</script>

<style lang="stylus" scoped>
.footer.nodesktop
  display none

.footer
  height 150px
  margin 30px 65px 0px
  display flex
  flex-direction row
  align-items stretch
  justify-content space-between
  & > .logo
    display flex
    flex-direction row
    justify-content flex-start
    align-items center
  & > .logo > .pre
    background-color pink
    width 64px
    height 64px
    margin-right 10px
  & > .logo > .vue
    font-family $ff-general
    font-size 2em
    font-weight normal
  & > .info
    display flex
    flex-direction row
    align-items center
    > .wrapper 
      height 60px
      display flex
      flex-direction row
      justify-content flex-end
      align-items center
      > *
        margin 0px 5px
    > .designby
      font-family $ff-designby
      font-size 2em
      font-weight normal
      margin 0px 0px 0px 10px
</style>

<i18n>
{
  "en": {
    "about": "About",
    "feedback": "Send Feedback",
    "designby": "Design by Flutter Gallery"
  },
  "zh": {
    "about": "关于 Learns-vues",
    "feedback": "发送反馈",
    "designby": "灵感来自Flutter Gallery"
  }
}
</i18n>