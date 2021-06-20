<template>
  <div class="home">
    <SplashPage class="splash" />
    <router-view name="demo" class="demo" />
    <router-view name="setting" class="setting" />
    <router-view name="content" class="content" />
  </div>
</template>

<script>
import SplashPage from './Splash'

export default {
  components: {
    SplashPage,
  },
}
</script>

<style lang="stylus" scoped>
.home
  /**
   * height 100% 必要性
   * 考虑这样：父级100%高度，并且覆盖隐藏，本级为普通布局元素（无100%高度，靠子级
   * 的高度支撑），本级给予子级的布局为flex，并且随高度自动收缩，这时候子级1设置
   * 高度100%，并且子级1的子级高度大于屏幕高度尺寸需要滚动浏览，这时候会导致：
   * 本级高度由子级决定，子级1高度100%，子级的子级高度远超过屏幕尺寸，并且子级的
   * 子级定位为正常定位，导致子级1高度越出窗口高度，导致本级高度越出窗口，导致被父级
   * 覆盖隐藏所截掉。问题的关键在于：
   * 1. 本级是正常布局， 正常布局高度可以越过窗口。
   * 2. 子级高度100%是自由收缩的高度，并非填充当前窗口高度
   *
   * 所以：
   * 1. 本级布局尺寸由上级决定，所以本级设置100%，确定高度。
   * 2. 子级1的高度100%由于本级确定而确定
   * 3. 子级开启覆盖滚动，子级的子级就不会越过窗口
   */
  height 100%
  display flex
  flex-direction column
  > .splash
    flex 0 0 auto
  > .setting
    flex 0 0 auto
  > .content
    flex 1 1 auto
  > .demo
    flex 1 1 auto
</style>