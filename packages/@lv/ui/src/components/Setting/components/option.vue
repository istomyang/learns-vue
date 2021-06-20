<template>
  <!-- 设置选项(bar+下拉选项) -->
  <div class="setting-opts-item">
    <div
      :class="[isExpanded ? 'expanded' : 'noexpanded']"
      class="banner"
      @click="expandOption"
    >
      <!-- 左边部分 -->
      <div class="left-part">
        <p class="title">{{ $t(`${data.title}.${data.title}`) }}</p>
        <p v-show="!isExpanded && !hasSwitcher" class="subtitle">
          {{ !hasSwitcher ? $t(`${data.title}.${data.selected}`) : null }}
        </p>
      </div>
      <!-- 右边部分 -->
      <div class="right-part">
        <div
          class="down-arrow"
          :class="{ rotate: isExpanded }"
          v-if="!hasSwitcher"
        />
        <switcher v-else :isOpen.sync="currentOpt" />
      </div>
    </div>
    <!-- 下拉选项 -->
    <transition name="op">
      <div v-show="isExpanded && !hasSwitcher" class="wrapper">
        <!-- 方案2: 使用 $parent -->
        <!-- <option-item
        v-for="op in data.optionsGroup"
        :name="op.title"
        :selected="data.selected"
        :key="op.id"
        >{{ $t(`${data.title}.${op.title}`) }}</option-item
      > -->
        <option-item
          v-for="op in data.optionsGroup"
          :name="op.title"
          :selected.sync="currentOpt"
          :key="op.id"
          >{{ $t(`${data.title}.${op.title}`) }}</option-item
        >
      </div>
    </transition>
  </div>
</template>

<script>
import optionItem from './item'
import switcher from './button'
import { SettingItem, ItemOption } from './typedefs'

export default {
  data() {
    return {
      isExpanded: false,
      // 当前值
      // 如何属性在对象之内, 无法使用响应式.
      currentOpt: this.data.selected,
      // 不能 this.currentOpt === 'boolean'
      hasSwitcher: !!(typeof this.data.selected === 'boolean'),
    }
  },
  props: {
    // 防止同时打开多个设置选项
    currentOpenSetting: Number,
    data: {
      type: SettingItem,
      required: true,
      // 这里必须为工厂函数,否则默认共用同一个实例
      default: () =>
        new SettingItem(0, 'Title', 'option-a', [
          new ItemOption(0, 'option-a'),
          new ItemOption(1, 'option-b'),
          new ItemOption(2, 'option-c'),
        ]),
    },
  },
  components: {
    optionItem,
    switcher,
  },
  methods: {
    expandOption() {
      // 视图
      if (!this.hasSwitcher) this.isExpanded = !this.isExpanded
      // 上传展开id
      this.$emit('update:currentOpenSetting', this.data.id)
    },
  },
  watch: {
    currentOpenSetting(newVal, old) {
      if (this.hasSwitcher) return
      if (newVal === this.data.id) {
        this.isExpanded = true
      } else {
        this.isExpanded = false
      }
    },
    currentOpt(newVal, oldVal) {
      if (newVal !== oldVal)
        this.$store.dispatch(`switch_${this.data.title}`, this.currentOpt)

      // i18n 获取state的值，更改。
      if (this.data.title === 'locale') {
        this.$root.$i18n.locale = this.$store.state.locale
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.setting-opts-item
  margin 0
  & > .banner
    display flex
    flex-direction row
    justify-content space-between
    background-color #eef3f3
    box-sizing border-box
    height 60px
  & > .banner:hover
    background-color #e5e9e9
    cursor pointer
  & > .expanded
    margin 10px 0px 0px 0px
    transition all 0.2s ease-in
  & > .noexpanded
    margin 5px 20px
    border-radius 10px
    transition all 0.2s ease
  & > *
    padding 10px 16px
  & > .wrapper
    margin 0 0 10px 20px
    padding 0

.left-part
  display flex
  flex-direction column
  justify-content center
  align-items flex-start

.right-part
  align-self center

.down-arrow
  height 0
  width 0
  margin-top 3px
  border 6px solid black
  border-left-color transparent
  border-right-color transparent
  border-bottom-color transparent
  transition transform 0.3s ease
  transform-origin 6px 3px
  &.rotate
    transform rotate(0.5turn)

.title
  padding 0
  margin 0
  font-size 1.6em
  font-family $ff-setting-general
  font-weight 400
  color #423d4c

.subtitle
  margin 0
  padding 0
  font-size 1.4em
  font-family $ff-setting-general
  font-weight 300
  color #b93c5d

.op-enter-active, .op-leave-active
  transition all 0.2s ease

.op-enter, .op-leave-to
  opacity 0
</style>

<i18n>
{
  "en": {
    "text_scale": {
      "text_scale": "Text Scale",
      "small": "Small",
      "normal": "Normal",
      "big": "Big",
      "large": "Large"
    },
    "locale": {
      "locale": "Locale",
      "zh": "zh_CN",
      "en": "en_US"
    },
    "theme": {
      "theme": "Theme Mode",
      "light": "dark",
      "dark": "light"
    },
    "low_animation": {
      "low_animation": "Low Animation"
    }
  },
  "zh": {
    "text_scale": {
      "text_scale": "文字缩放",
      "small": "小",
      "normal": "正常",
      "big": "大",
      "large": "超大"
    },
    "locale": {
      "locale": "语言区域",
      "zh": "简体中文",
      "en": "英文(美国)"
    },
    "theme": {
      "theme": "主题背景",
      "dark": "深色",
      "light": "浅色"
    },
    "low_animation": {
      "low_animation": "慢镜头"
    }
  }
}
</i18n>