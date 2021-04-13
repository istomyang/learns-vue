<template>
  <div
    class="card"
    :style="{
      backgroundColor: bgc,
      height: `${height}px`,
      width: `${width}px`,
      marginLeft: `${borderMargin[0]}px`,
      marginRight: `${borderMargin[1]}px`,
    }"
  >
    <div class="wrapper">
      <h3 class="title">{{ title }}</h3>
      <p class="disc">{{ discription }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  props: {
    id: Number,
    title: String,
    discription: String,
    bgc: String,
    cardFullWidth: Number,
    scrollLeft: Number,
    cards: Array,
  },
  data() {
    return {
      height: 200,
    }
  },
  computed: {
    ...mapState(['window_width']),
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
    borderMargin() {
      if (this.id === 0 && !this.isDesktop) return [30, 8]
      if (this.id === 0 && this.isDesktop) return [8, 8]
      if (this.id === this.cards.length - 1 && !this.isDesktop) return [8, 30]
      if (this.id === this.cards.length - 1 && this.isDesktop) return [8, 8]
      return [8, 8]
    },
    width() {
      return this.cardFullWidth - (this.isDesktop ? 16 : 16)
    },
    minX() {
      return (this.id - 1) * this.cardFullWidth
    },
    midX() {
      return this.id * this.cardFullWidth
    },
    maxX() {
      return (this.id + 1) * this.cardFullWidth
    },
    inStage() {
      let min = this.id * this.cardFullWidth
      let max = min + this.cardFullWidth
      return this.scrollLeft >= min && this.scrollLeft < max
    },
  },
  watch: {
    window_width() {
      this.adjustHeight()
    },
    scrollLeft(newVal) {
      let that = this
      /**
       * 高度变化算法
       * 一个Card的高度变化, 从小 - 大 - 小, 经历两个Card宽度, 以最开始为原点,
       * 形状类似:
       * y = 40/w * (ol-minX) + 140 [0,w]
       * y = -40/2 * (ol-miX) + 80 + 140 [w,2w]
       */
      if (!this.isDesktop) {
        // 保证性能和防止过渡调用
        window.requestAnimationFrame(function () {
          let delta = newVal - that.minX

          if (newVal <= that.midX && delta > 0) {
            that.height = 170 + (30 / that.cardFullWidth) * delta
          }
          if (newVal > that.midX && newVal <= that.maxX) {
            that.height = 170 + 60 - (30 / that.cardFullWidth) * delta
          }
        })
      }
    },
  },
  methods: {
    adjustHeight() {
      if (this.isDesktop) {
        this.height = 200
      } else {
        // 从desktop到phone, 应该到谁180
        if (this.inStage) {
          this.height = 200
        } else {
          this.height = 170
        }
      }
    },
  },
  mounted() {
    // 下次DOM更新前调用
    this.$nextTick(function () {
      this.adjustHeight()
    })
  },
}
</script>

<style scoped>
.card {
  position: relative;
  box-shadow: 2px 2px 2px 0px #c7cbcb;
}
.wrapper {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.title,
.disc {
  font-size: 1.5em;
  margin: 0;
}
</style>