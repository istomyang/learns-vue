<template>
  <div class="preview" id="preview-intersection-observer">
    <h1>
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver"
        >Use IntersectionObserver</a
      >
    </h1>
    <div>
      <img :data-src="imgSrc" alt="" class="intersection-img" />
      <img :data-src="imgSrc" alt="" class="intersection-img" />
      <img :data-src="imgSrc" alt="" class="intersection-img" />
      <img :data-src="imgSrc" alt="" class="intersection-img" />
      <img :data-src="imgSrc" alt="" class="intersection-img" />
      <img :data-src="imgSrc" alt="" class="intersection-img" />
      <img :data-src="imgSrc" alt="" class="intersection-img" />
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
    observe(father, child, callback) {
      const fatherDOM = document.getElementById(father)
      const options = {
        root: fatherDOM,
        rootMargin: '0px',
        threshold: 0.5,
      }
      const observer = new IntersectionObserver(callback, options)
      const elements = document.querySelectorAll(child)
      for (let i = 0; i < elements.length; i++) {
        observer.observe(elements[i])
      }
    },
    lazyLoad() {
      const cb = (entries, observer) => {
        let init = false

        entries.forEach(entry => {
          const target = entry.target
          if (!init && entry.isIntersecting) {
            init = true
            target.src = target.getAttribute('data-src')
            target['data-src'] = ''
          }
        })
      }
      this.observe('#preview-intersection-observer', '.intersection-img', cb)
    },
  },
  mounted() {
    this.lazyLoad()
  },
  meta: {
    option_title: {
      zh: '使用 IntersectionObserver',
      en: 'Using IntersectionObserver',
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

.intersection-img
  display block
  height 300px
  margin-bottom 10px
  object-fit cover
  border #737575 1px solid
</style>
