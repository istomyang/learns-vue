<template>
  <div class="gallery" :class="[isDesktop ? 'desktop' : 'nodesktop']">
    <div class="title">{{ $t('caption') }}</div>
    <div
      class="carousel"
      @mousedown="down"
      @mousemove="move"
      @blur="up"
      ref="c"
    >
      <div class="w">
        <card
          v-for="card in galleries"
          class="card"
          :id="card.id"
          :cid="card.cid"
          :key="card.key"
          :title="card.card_title"
          :summary="card.card_summary"
          :bg="card.card_bg"
          :icon="card.card_icon"
          :theme="card.theme"
          :router="card.router"
          :placeholder="card.placeholder"
          :cardFullWidth="cardFullWidth"
          :scrollLeft="scrollLeft"
          :cards="galleries"
        />
      </div>
    </div>
    <div class="arrow-wrapper">
      <div class="left-arrow" @click="leftClick" v-show="leftShow">
        <div class="arrow" />
      </div>
      <div class="right-arrow" @click="rightClick" v-show="rightShow">
        <div class="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
import card from './components/card'
import { mapGetters, mapState } from 'vuex'
import galleries from '../../data/gallery'

export default {
  data() {
    return {
      galleries,
      isScroll: false,
      scrollLeft: 0,
      btn_lock: false,
    }
  },
  components: { card },
  methods: {
    /**
     * 滚动列表跟随鼠标 和 平滑滚动到停靠点
     * 1. 通过设置 `this.$refs.c.scrollLeft` 实现JS操作滚动
     * 2. 通过设置 `MounseEvent.movementX` 获得速度, 从而跟随鼠标
     * 3. 通过 `this.$refs.c.scrollTo` 实现平滑滚动
     * 4. 通过 mousedown, mousemove, mouseup 和 标记位 isScroll 实现 滑动事件
     */
    down() {
      // 标记位, 实现滑动效果
      this.isScroll = true
    },
    move(e) {
      if (this.isScroll) {
        // 滚动速度, 可以设置响应速度
        let midVal = e.movementX / 1
        this.$refs.c.scrollLeft -= midVal
        // 更新供组件消费
        this.scrollLeft = this.$refs.c.scrollLeft
      }
    },
    up() {
      this.isScroll = false
      // 滑动停靠位
      this.$refs.c.scrollTo({
        left: this.landing,
        behavior: 'smooth',
      })
      // 停靠完, 需要强制对齐
      // 不能用 this.$refs.c.scrollLeft 因为DOM没有更新过来
      this.scrollLeft = this.landing
    },
    // 全局的up会进行强制对齐
    leftClick() {
      if (!this.btn_lock) {
        this.btn_lock = true

        this.clickMove('left')
        this.btn_lock = false
      }
    },
    rightClick() {
      if (!this.btn_lock) {
        this.btn_lock = true

        this.clickMove('right')
        this.btn_lock = false
      }
    },
    clickMove(direction) {
      let speed = direction === 'left' ? -20 : 20
      this.isScroll = true
      let that = this
      if (direction !== 'left' && direction !== 'right') return
      let distance = this.cardFullWidth
      const split = []

      let len = Math.floor(distance / Math.abs(speed))
      while (len > 0) {
        split.push(speed)
        len--
      }
      split.push(distance - speed * len)

      function step() {
        that.$refs.c.scrollLeft += split.pop()
        that.scrollLeft = that.$refs.c.scrollLeft
        if (split.length !== 0) {
          window.requestAnimationFrame(step)
        } else {
          that.up()
        }
      }

      window.requestAnimationFrame(step)
    },
  },
  computed: {
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
    ...mapState({
      windowWidth: 'window_width',
    }),
    containerWidth() {
      /**
       * 关于 containerWidth 初始化
       * 一开始选择使用 $refs 进行获取，但此有这些问题：
       * 1. 不是响应式的，需要额外监听动态修改
       * 2. 实例挂载完才能获取到值（mounted的nextTicker才准确）
       *
       * 所以采用计算的方法，根据宽度模式固定的边距，
       * 因为 windowWidth 是响应式的，所以自动更新。
       */
      return this.windowWidth - (this.isDesktop ? 120 : 0)
    },
    // 包含margin
    cardFullWidth() {
      if (this.isDesktop) {
        // containerWidth 不是响应式的,需要强制更新
        return this.containerWidth / 4
      } else {
        return this.containerWidth - 44
      }
    },
    // 列表缓冲到卡片开端和结束端
    landing() {
      let sl = this.scrollLeft
      let c = this.containerWidth
      let cfw = this.cardFullWidth
      let total = this.galleries.length * cfw + 22 * 2

      let result

      if (!this.isDesktop) {
        // 特例情况
        let firstX = c / 2
        let lastX = total - 22 - cfw - 22
        if (sl < firstX) return 0
        if (sl > lastX) return total - c
        result = Math.round(sl / cfw) * cfw + 10
      } else {
        // 算法: 利用四舍五入的特性, 把同一位置点的区域区分开来.
        result = Math.round(sl / cfw) * cfw
      }

      return result
    },
    leftShow() {
      return this.scrollLeft > 100 && this.isDesktop
    },
    rightShow() {
      return (
        this.scrollLeft <
          this.cardFullWidth * (this.galleries.length - 1) - 10 &&
        this.isDesktop
      )
    },
  },
  mounted() {
    // 全局的鼠标抬起 停止滚动
    window.addEventListener('mouseup', this.up)
  },
  destroyed() {
    window.removeEventListener('mouseup', this.up)
  },
}
</script>

<style lang="stylus" scoped>
.gallery
  display flex
  flex-direction column
  justify-content center
  align-content center
  & > .title
    font-family $ff-general
    font-weight 700
    color #007477
    align-self flex-start
  &.desktop
    margin 50px 60px 0px
    > .title
      font-size $fz-gallery-title
      margin 0px 0px 20px 18px
  &.nodesktop
    margin 20px 0px 0px
    > .title
      font-size $fz-gallery-nodesk-title
      margin 0px
      margin-left 30px
      margin-bottom 20px

.carousel
  flex 0 0 auto
  height 210px
  position relative
  padding 0px
  margin 0px
  overflow scroll
  // border 1px dashed pink
  --ms-overflow-style none
  scrollbar-width none
  &::-webkit-scrollbar
    display none

// 中间层, 解决容器在flex-start时右margin无法移到视野框
// 固定card的布局有利于操作
// card宽是JS设置的, 绝对定位width的auto是0
.w
  display flex
  flex-direction row
  position absolute
  justify-content space-between
  align-items center
  height 210px
  & > .card
    box-sizing border-box
    flex 1 1 auto
    user-select none
    border-radius 10px
</style>

<style scoped>
.arrow-wrapper {
  position: relative;
}

.left-arrow {
  background-color: #737575;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  position: absolute;
  top: -150px;
  left: -20px;
}

.left-arrow .arrow {
  position: absolute;
  top: 20px;
  left: 22px;
  height: 16px;
  width: 16px;
  border-left: 5px solid white;
  border-top: 5px solid white;
  transform: rotate(-45deg);
}

.right-arrow {
  background-color: rgba(0, 0, 0, 0.397);
  height: 60px;
  width: 60px;
  border-radius: 50%;
  position: absolute;
  top: -150px;
  right: -20px;
}

.right-arrow .arrow {
  position: absolute;
  top: 20px;
  right: 22px;
  height: 16px;
  width: 16px;
  border-left: 5px solid white;
  border-top: 5px solid white;
  transform: rotate(-45deg) scale(-1);
}
</style>
<i18n>
{
  "en": {
    "caption": "Gallery"
  },
  "zh": {
    "caption": "图库"
  }
}

</i18n>
