<template>
  <!-- 通过判断区分具体标签 -->
  <component :is="who" v-bind="$attrs">
    <!-- 用于载入中, button不可用 -->
    <LoadingIndicator v-if="isLoading" />

    <span>
      <!-- 有文字,前面是loading -->
      <LoadingIndicator v-if="(isLoadingWithTxt)" />
      <!-- 有文字,前面是图标 -->
      <CustomIcon
        v-else-if="isWithIconLeft"
        :icon="iconLeft"
        class="button-icon-right"
      />

      <!-- 文字内容 -->
      <span class="default-slot">
        <slot>{{ label }}</slot>
      </span>

      <!-- 按钮右上角角标 -->
      <div v-if="tag != null" class="tag-wrapper">
        <div class="tag">{{ tag }}</div>
      </div>

      <!-- 按钮右边的图标 -->
      <CustomIcon
        v-if="isWithIconRight"
        :icon="iconRight"
        class="button-icon-right"
      />
    </span>
  </component>
</template>

<script>
/**
  按钮
  参考 :https://vuejs.github.io/ui/#/demo/button
 */

import LoadingIndicator from '../loading/loading_indicator1'
import CustomIcon from '../icon/icon1';

export default {
  name: 'Button1',

  inheritAttrs: false,

  props: {},

  components: {
    LoadingIndicator,
    CustomIcon
  },

  computed: {
    // 判断实际标签
    who() {
      if (this.$attrs.to) {
        return 'router-link'
      } else if (this.$attrs.href) {
        return 'a'
      } else {
        return 'button'
      }
    },
  },
}
</script>

<style lang="stylus" scoped></style>