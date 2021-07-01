<template>
  <div class="preview">
    <div></div>
  </div>
</template>

<script>
export default {
  methods:{
    getDomObject(selector){
      return document.querySelector(selector)
    },
    getViewPortHeight(){
      return document.documentElement.clientHeight
    },
    getOffsetTop(selector){
      const elm = this.getDomObject(selector)
      return elm.offsetTop
    },
    getScrollTop(selector){
      const elm = this.getDomObject(selector)
      return elm.scrollTop
    }
  },
  meta: {
    option_title: {
      zh: '原生方法',
      en: 'With CSS and JS',
    },
    preview_title: {
      zh: '示范预览',
      en: 'Preview',
    },
  },
}
</script>

<style lang="stylus" scoped>
.preview
  position relative
  height 100%
  display flex
  flex-direction column

</style>

<style scoped>
</style>