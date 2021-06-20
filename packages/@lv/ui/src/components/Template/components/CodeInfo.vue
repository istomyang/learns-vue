<template>
  <div class="code">
    <!-- https://prismjs.com/plugins/copy-to-clipboard/ -->
    <!-- <button
      class="copy-to-clipboard-button"
      type="button"
      data-copy-state="copy"
    >
      <span>Copy</span>
    </button> -->
    <!-- 标签回车会导致首行缩进混乱等问题 -->
    <!-- 方案可行：https://prismjs.com/plugins/normalize-whitespace/ -->
    <!-- 不能自动更新数据 -->
    <!-- https://github.com/PrismJS/prism/issues/1153#issuecomment-823056225 -->
    <pre
      class="pre no-line-numbers"
    ><code class="language-html" v-text="code"></code></pre>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Prism from 'prismjs'

// https://prismjs.com/plugins/normalize-whitespace/
Prism.plugins.NormalizeWhitespace.setDefaults({
  'remove-trailing': true,
  'remove-indent': true,
  'left-trim': true,
  'right-trim': true,
})

export default {
  data() {
    return {}
  },
  inject: ['info_data'],
  computed: {
    ...mapState({ id: 'current_demo_preview' }),
    code() {
      for (let id in this.info_data.codes) {
        if (id === this.id) {
          let code = this.info_data.codes[id]
          this.$nextTick(function () {
            Prism.highlightAll()
          })
          return `${code.html[0]}\n\n${code.js[0]}\n\n${code.stylus[0]}`
        }
      }
      return `<script>console.log('sorry!')<\/script>`
    },
  },
}
</script>

<style lang="stylus" scoped>
.code
  padding 0px 80px
  height 100%
  font-size 1.4em
  overflow scroll
  --ms-overflow-style none
  scrollbar-width none
  &::-webkit-scrollbar
    display none

.pre
  background-color transparent
  --ms-overflow-style none
  scrollbar-width none
  &::-webkit-scrollbar
    display none
</style>
