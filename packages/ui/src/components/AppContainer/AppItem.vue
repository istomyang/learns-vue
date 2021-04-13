<template>
  <div
    class="app-item"
    :class="{
      'is-active': isActive,
      'is-in-stage': isInStage,
      'is-hover': isHover,
      'is-animating': isAnimating,
      'is-desktop': $parent.isDesktop,
    }"
    @click="handleItemClick"
    :style="itemStyle"
  >
    <div v-show="!isActive" class="app-item__mask">
      <!-- 遮罩 -->
    </div>
    <!-- TODO: Card content here -->
    <div class="app-item__content"></div>
  </div>
</template>

<script>
import { autoPrefixer } from '../../utils/css'

const CARD_SCALE = 0.85

class Item {
  constructor(id, title, description, imageShow) {
    this.id = id
    this.title = title
    this.description = description
    this.imageShow = imageShow
  }
}

export default {
  name: 'Home.AppItem',

  props: {
    itemData: {
      type: Item,
      required: true,
    },
  },

  data() {
    return {
      isActive: false,
      // whether show as backcard in stage
      isInStage: false,
      isHover: false,
      isAnimating: false,
      isReady: false,
      translate: 0,
      scale: 1,
    }
  },

  methods: {
    // activeItem is note in father's data scope
    handleItemClick() {
      const parent = this.$parent
      const index = parent.items.indexOf(this)
      parent.setActiveItem(index)
    },

    // 自己的值,激活的值,上一次值
    translateItem(index, activeIndex, oldIndex) {
      const length = this.$parent.items.length

      if (index !== activeIndex && length > 2 && this.$parent.loop) {
        index = this.processIndex(index, activeIndex, length)
      }

      // check whether in stage
      this.isInStage = Math.round(Math.abs(index - activeIndex)) <= 1
      this.isActive = index === activeIndex
      this.translate = this.calcTranslate(index, activeIndex)
      this.scale = this.isActive ? 1 : CARD_SCALE

      this.isReady = true
    },

    calcTranslate(index, activeIndex) {
      const parentWidth = this.$parent.$el.offsetWidth
      if (this.isInStage) {
        // TODO: 是否是经验值
        return (parentWidth * (3 - CARD_SCALE)) / 4
      } else if (index < activeIndex) {
        return (-(1 + CARD_SCALE) * parentWidth) / 4
      } else {
        return ((3 + CARD_SCALE) * parentWidth) / 4
      }
    },

    // 处理当上一个index和下一个index在特殊位置时,处理办法
    processIndex(index, activeIndex, length) {
      if (activeIndex === 0 && index === length - 1) {
        return -1
      } else if (activeIndex === length - 1 && index === 0) {
        return length
      } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
        return length + 1
      } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
        return -2
      }
      return index
    },
  },

  computed: {
    itemStyle() {
      const style = {
        transform: `translateX(${this.translate}px scale(${this.scale}))`,
      }
      return autoPrefixer(style)
    },
  },
}
</script>

<style lang="stylus" scoped></style>