<template>
  <div class="preview" id="preview-data-src">
    <div>
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
      <img :data-src="imgSrc" alt="" class="preview-data-src-img" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrc:
        'https://pic3.zhimg.com/v2-4bba972a094eb1bdc8cbbc55e2bd4ddf_1440w.jpg?source=172ae18b',
    }
  },
  methods: {
    getDomObject(selector) {
      return document.querySelector(selector)
    },
    getRoot() {
      return this.getDomObject('#preview-data-src')
    },
    getViewPortHeight() {
      return this.getRoot().clientHeight
    },
    getTop(elm) {
      // let elm = this.getDomObject(selector)
      let top = elm.offsetTop
      while ((elm = elm.offsetParent)) {
        top += elm.offsetTop
      }
      return top
    },
    getScrollTop(selector) {
      const elm = this.getDomObject(selector)
      return elm.scrollTop
    },
    lazyLoad(selector) {
      const images = document.querySelectorAll(selector)
      const viewPortHeight = this.getViewPortHeight()
      let scrollTopPosition = this.getRoot().scrollTop
      for (let i = 0; i < images.length; i++) {
        if (viewPortHeight + scrollTopPosition > this.getTop(images[i])) {
          images[i].src = images[i].getAttribute('data-src')
        }
      }
    },
  },
  mounted() {
    const win = this.getRoot()
    const self = this
    win.onscroll = function () {
      window.setTimeout(
        function () {
          self.lazyLoad('.preview-data-src-img')
        },
        0,
        self
      )
    }
  },
  meta: {
    option_title: {
      zh: '使用 data-src',
      en: 'Using data-src',
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

.preview-data-src-img
  display block
  height 300px
  margin-bottom 10px
  object-fit cover
</style>

<style scoped></style>
