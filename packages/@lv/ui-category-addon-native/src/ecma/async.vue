<template>
  <div class="preview">
    
  </div>
</template>

<script>
export default {
  meta: {
    option_title: {
      zh: '异步',
      en: 'Async',
    },
    preview_title: {
      zh: '异步',
      en: 'Async',
    },
  },
}
</script>

<style lang="stylus" scoped>
.preview
  position relative
  height 100%

.box
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  height 200px
  width 200px
  background linear-gradient(90deg, #03a9f4, #ffeb3b, #03a9f4)
  background-size 400%
  border-radius 10px
  animation sun 5s infinite reverse

.box::before
  content ''
  position absolute
  left -5px
  right -5px
  top -5px
  bottom -5px
  background linear-gradient(90deg, #03a9f4, #ffeb3b, #03a9f4)
  background-size 400%
  filter blur(20px)
  z-index -1
  animation sun 5s infinite reverse

@keyframes sun
  0%
    background-position 0% 0%
  100%
    background-position -400% 0
</style>

<style scoped>
</style>