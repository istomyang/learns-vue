<template>
  <div class="demo" :class="[isDesktop ? 'desktop' : 'nodesktop']">
    <div class="banner">
      <OB class="back" icon="arrow_back" name="back" @click="handleClick" />
      <div class="right-part">
        <OB class="note" icon="info" name="note" @click="handleClick" />
        <OB class="options" icon="tune" name="options" @click="handleClick" />
        <OB class="code" icon="code" name="code" @click="handleClick" />
        <!-- 外部参考 -->
        <!-- https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a -->
        <OB
          class="ref"
          icon="library_books"
          :href="ref"
          target="_blank"
          rel="noopener noreferrer"
        />
        <OB
          class="full"
          :icon="fullscreen_icon"
          name="full"
          @click="handleClick"
        />
      </div>
    </div>
    <div class="body" :class="{ 'dark-bgc': current_info === 'code' }">
      <Info
        class="info"
        :show="current_info"
        :class="{ fullscreen: fullscreen }"
      />
      <Preview class="preview" />
    </div>
  </div>
</template>

<script>
import OB from './components/OperationButton'
import { mapGetters } from 'vuex'
import Info from './components/Info'
import Preview from './components/Preview'

import { infos } from '../../data/category'

export default {
  metaInfo: {
    title: 'Demo',
    titleTemplate: 'LV-%s',
  },
  data() {
    return {
      fullscreen: false,

      // 默认note
      current_info: 'note',
    }
  },

  // 当前的路由请求参数
  // 格式：category/demo
  props: ['categoryid', 'demoid'],
  provide() {
    return {
      info_data: this.info_data,
    }
  },
  methods: {
    handleClick(name) {
      switch (name) {
        case 'back':
          this.$router.back()
          break
        case 'options':
          this.current_info = name
          break
        case 'note':
          this.current_info = name
          break
        case 'code':
          this.current_info = name
          break
        case 'full':
          this.fullscreen = !this.fullscreen
          break
        default:
          break
      }
    },
  },
  computed: {
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
    info_data() {
      return infos[this.categoryid][this.demoid]
    },
    ref() {
      return this.info_data.ref
    },
    fullscreen_icon() {
      return this.fullscreen ? 'fullscreen_exit' : 'fullscreen'
    },
  },
  components: { OB, Info, Preview },
}
</script>

<style lang="stylus" scoped>
.demo
  background-color #e5ebeb
  padding 0px
  display flex
  flex-direction column
  &.desktop
    border-top-left-radius 48px
    border-top-right-radius 48px
  .banner
    flex 0 0 auto
    padding 0px 100px
    height 65px
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    .back
      margin-left 0px
      >>> svg
        fill #030303
    .right-part
      margin-right 0px
      > *
        display inline-block
      >>> svg
        fill #030303
  .body
    flex 1 1 auto
    display flex
  &.desktop > .body
    padding 20px 100px 20px
    /**
     * 高度计算问题:
     * 1. 高度如果是auto，则子级组件的100%无法计算
     * 2. 如果从上到下全部100%高度，则出现子级高度和父级相同，
     *    但父级还有其他子级，导致内容覆盖边界的情况。
     * 3. 解决办法就是，在弹性布局中，给予height为0px，使得
     *    flex: 1; 让其自由伸缩，从而确定高度，这个时候，子级
     *    高度正常。
     */
    height 0
    margin 0px
    flex-direction row
    justify-content space-around
    > .info
      flex 0 1 auto
      height 100%
      width 650px
      transition all 0.3s ease
      position relative
      overflow hidden
    > .preview
      flex 1 1 auto
      height 100%



.dark-bgc
  background-color #251e2f

.info.fullscreen
  width 0px !important
</style>
