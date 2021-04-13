<template>
  <div
    class="setting"
    :class="[isDesktop ? 'desktop' : 'nodesktop', isOpen ? 'opened' : 'closed']"
  >
    <div @click.stop="switchOpen" class="button">
      <SvgIcon class="svg-icon" :isopen="isOpen" />
    </div>
    <component
      :is="component"
      name="s"
      :class="[isDesktop ? '' : 'transition-div']"
    >
      <div
        class="setting-body"
        ref="settingBody"
        :class="[isDesktop ? 'desktop' : 'nodesktop']"
        v-show="handle"
      >
        <div class="title">{{ $t('caption') }}</div>
        <OptionsGroup />
        <div class="info" v-show="!isDesktop">
          <div class="wrapper">
            <B icon="info">{{ $t('about') }}</B>
            <B icon="feedback">{{ $t('feedback') }}</B>
          </div>
          <p class="designby">{{ $t('designby') }}</p>
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import SvgIcon from './src/widgets/icon'
import OptionsGroup from './src/group'
import B from '../Help/bottom'
import { mapGetters, mapState } from 'vuex'

export default {
  data() {
    return {
      /**
       * 思路：
       * 1. nodesktop下，使用最外层div作为显示过渡
       * 2. desktop下，使用动画
       */
      isOpen: false,
    }
  },
  components: {
    SvgIcon,
    B,
    OptionsGroup,
  },
  methods: {
    switchOpen() {
      this.isOpen = !this.isOpen
    },
  },
  computed: {
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
    handle() {
      // nodesktop下，默认显示
      // desktop下，由isOpen决定
      return !this.isDesktop || this.isOpen
    },
    component() {
      return this.isDesktop ? 'transition' : 'div'
    },
  },
}
</script>

<style lang="stylus" scoped>
.setting
  position relative
  background-color #e6ebeb
  .button
    z-index 99
    background-color #fafbfb
    border-bottom-left-radius 10px
    cursor pointer
    .svg-icon
      position absolute
      left 10px
      bottom 2px
    &:hover
      background-color #f0f1f1

.setting.desktop
  position relative
  .button
    border-top-right-radius 40px
    height 60px
    width 65px
    position absolute /* svg定位用 */
    right 0

.setting.nodesktop
  transition all 0.5s ease
  .button
    height 45px
    width 65px
    position absolute
    top 0px
    right 0px


.setting.nodesktop.closed
  height 0px

.setting.nodesktop.opened
  height 80%

// 额外嵌套的div会导致子组件100%无效
.transition-div
  height 100%

.s-enter-active, .s-leave-active
  transition all 0.2s ease-out

.s-enter, .s-leave-to
  /* transform: scale(0.3); */
  opacity 0
  /*
   会导致属性被覆盖
  */
  width 0px !important
  height 0px !important
  border-top-left-radius 0 !important
  border-bottom-left-radius 0 !important
  border-bottom-right-radius 0 !important

.setting-body
  direction ltr
  z-index 98
  background-color #fafbfb
  overflow scroll
  /* 隐藏滚动条 */
  -ms-overflow-style none /* IE 10+ */
  scrollbar-width none /* Firefox */
  &::-webkit-scrollbar
    display none /* Chrome Safari */
  &.desktop
    position absolute
    top 0px
    right 0px
    /* 删除影响过渡的计算 */
    height 400px
    width 500px
    border-radius 40px
    box-shadow 1px 1px 2px 2px #c8cdcd
  &.nodesktop
    height 100%
  & > .title
    padding 0px 30px
    font-size $fz-setting-title
    font-family 'Open Sans', 'Noto Sans SC', serif
    margin-top 45px
    margin-bottom 10px
  &.nodesktop > .title
    font-size $fz-setting-nodesk-title 

.wrapper
  margin 15px 0px
  padding 5px 0px
  border-top 2px solid #e4eaea
  border-bottom 2px solid #e4eaea
  display flex
  flex-direction column
  align-items stretch

.designby
  font-family $ff-designby
  font-size 1.8em
  font-weight normal
  margin 15px auto auto 20px
</style>

<i18n>
{
  "en": {
    "caption":"Setting",
    "about": "About",
    "feedback": "Send Feedback",
    "designby": "Design by Flutter Gallery"
  },
  "zh": {
    "caption":"设置",
    "about": "关于 Learns-vues",
    "feedback": "发送反馈",
    "designby": "灵感来自Flutter Gallery"
  }
}
</i18n>