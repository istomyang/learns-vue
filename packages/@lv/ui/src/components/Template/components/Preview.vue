<template>
  <div class="preview">
    <div class="banner">{{ $t('preview.title') }}</div>
    <component :is="component" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  inject: ['info_data'],
  computed: {
    ...mapState({ id: 'current_demo_preview' }),
    component() {
      return this.info_data.previews[this.id].componentName
    },
    title() {
      return this.info_data.previews[this.id].title
    },
  },
  created() {
    let zh = {
      preview: {
        title: this.info_data.previews[this.id].title.zh,
      },
    }
    let en = {
      preview: {
        title: this.info_data.previews[this.id].title.en,
      },
    }

    this.$i18n.mergeLocaleMessage('zh', zh)
    this.$i18n.mergeLocaleMessage('en', en)
  },
}
</script>

<style lang="stylus" scoped>
.banner
  background-color #6a0ee6
  height 54px
  font-size 2.4em
  line-height 54px
  font-weight normal
  font-family $ff-d-title
  color #fff
  padding-left 20px

.preview
  border-radius 10px
  background-color #fff
  height 100%
  margin-bottom 30px
  overflow scroll
  --ms-overflow-style none
  scrollbar-width none
  &::-webkit-scrollbar
    display none
</style>
