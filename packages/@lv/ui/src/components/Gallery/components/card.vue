<template>
  <div
    class="card"
    :style="{
      backgroundImage: `url(${bg})`,
      height: `${height}px`,
      width: `${width}px`,
      marginLeft: `${borderMargin[0]}px`,
      marginRight: `${borderMargin[1]}px`,
    }"
    :class="[theme, { placeholder: placeholder }]"
    @click="click"
  >
    <div v-if="placeholder" class="empty">
      {{ $t('gallery.placeholder') }}
    </div>
    <div v-else>
      <img :src="icon" alt="" class="icon" />
      <div class="wrapper">
        <h3 class="title">{{ $t(`gallery.${this.cid}.title`) }}</h3>
        <p class="disc">{{ $t(`gallery.${this.cid}.summary`) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  props: [
    'id',
    'cid',
    'title',
    'summary',
    'bg',
    'icon',
    'cardFullWidth',
    'scrollLeft',
    'cards',
    'theme',
    'placeholder',
    'router',
  ],
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
    background() {
      return `border-box transparent url(${this.bg}) border-box center no-repeat cover`
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
    click() {
      this.$router.push({ path: `${this.router}` })
    },
  },
  created() {
    this.$i18n.mergeLocaleMessage('zh', {
      gallery: {
        [this.cid]: {
          title: this.title.zh,
          summary: this.summary.zh,
        },
      },
    })
    this.$i18n.mergeLocaleMessage('en', {
      gallery: {
        [this.cid]: {
          title: this.title.en,
          summary: this.summary.en,
        },
      },
    })
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
  background-clip: border-box;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.icon {
  position: absolute;
  height: 50px;
  width: 50px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.card.dark > * {
  color: #f0f1f1;
}

.card.placeholder {
  background-image: none;
  background: #808b96;
}

.card.placeholder .empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.6em;
  color: #ebedef;
}
</style>

<i18n>
{
  "zh": {
    "gallery": {
      "placeholder": "占位图"
    }
  },
  "en": {
    "gallery": {
      "placeholder": "Empty Card"
    }
  }
}

</i18n>