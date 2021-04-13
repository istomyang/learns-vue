<template>
  <div class="app-container">
    <div class="wrapper">
      <template v-for="app in items">
        <AppItem :obj="app" :key="app.id" />
      </template>
    </div>
  </div>
</template>

<script>
import { DESKTOP_WIDTH } from '../../config'

export default {
  name: 'Home.AppContainer',

  props: {
    initIndex: {
      type: Number,
      default: 0,
    },
    height: String,
    trigger: {
      type: String,
      default: 'hover',
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator(val) {
        return ['horizontal', 'vertical'].indexOf(val) !== -1
      },
    },
  },

  data() {
    return {
      // 通过子组件获得
      items: [],
      isDesktop: false,
      activeIndex: -1,
      timer: null,
      hover: false,
      toasts: {},
    }
  },

  computed: {},

  watch: {
    items(val) {
      this.toasts.itemsAdd()
      if (val.length > 0) this.setActiveItem(this.initIndex)
    },

    activeIndex(nowVal, oldVal) {
      if (oldVal > -1) {
      }
    },
  },

  methods: {
    // set now active item's index to this.activeIndex
    setActiveItem(index) {
      // if index === 'item.name'
      if (typeof index === 'string') {
        const _findItem = this.items.find((ele) => ele.name === index)
        if (!!_findItem) {
          index = this.items.indexOf(_findItem)
        }
      }

      index = Number(index)
      // if index === 1.2
      if (isNaN(index) || index !== Math.floor(index)) {
        console.warn('Home.AppContainer.setActiveItem: index must be integer')
        return
      }

      let length = this.items.length
      const oldIndex = this.activeIndex
      if (index < 0) {
        // 倒数
        this.activeIndex = this.loop ? length - 1 : 0
      } else if (index >= length) {
        // 返回开始/停留原地
        this.activeIndex = this.loop ? 0 : length - 1
      } else {
        // 内部范围
        this.activeIndex = index
      }
    },

    resetItemPosition(oldIndex) {
      this.items.forEach((item, index) => {
        item.trans
      })
    },
  },

  created() {
    this.isDesktop = this.$el.offsetWidth >= DESKTOP_WIDTH

    this.toasts = {
      itemsAdd: () => Vue.$toast.info('New Items add!'),
    }
  },

  mounted() {
    this.items = this.$children.filter(
      (kid) => kid.$options.name === 'Home.AppItem'
    )
    this.$nextTick(() => {})
  },

  beforeDestroy() {
    for (item in this.toasts) {
      item.dismiss()
    }
  },
}
</script>

<style lang="stylus" scoped></style>