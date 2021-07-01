<template>
  <div class="demo" @click.capture.prevent="handleClick">
    <Icon class="icon" :icon="icon" />
    <div class="content">
      <h2 class="title">{{ $t('item.name') }}</h2>
      <p class="summary">{{ $t('item.summary') }}</p>
    </div>
  </div>
</template>

<script>
import Icon from '../../Shared/Icon'
export default {
  props: {
    id: String,
    name: [Object, String],
    summary: [Object, String],
    categoryid: String,
    icon: {
      type: String,
      default: 'face',
    },
    previewsId: Array,
  },

  components: { Icon },
  methods: {
    handleClick() {
      const first = this.previewsId[0]
      this.$store.dispatch('switch_preview', first)
      // this.$store.
      this.$router.push({
        path: `/home/categories/${this.categoryid}/${this.id}`,
      })
    },
  },
  created() {
    this.$i18n.mergeLocaleMessage('zh', {
      item: {
        name: this.name.zh,
        summary: this.summary.zh,
      },
    })
    this.$i18n.mergeLocaleMessage('en', {
      item: {
        name: this.name.en,
        summary: this.summary.en,
      },
    })
  },
}
</script>

<style lang="stylus" scoped>
.demo
  flex 0 0 auto
  height 80px
  display flex
  flex-direction row
  justify-content flex-start
  align-items center
  background-color #ffffff
  &:hover
    background-color #f0f1f1
  & > .icon
    height 32px
    width 32px
    // background-color rgb(121, 123, 207)
    margin 0px 20px
    flex 0 0 auto
    & > svg
      fill red
  & > .content
    flex 1 1 auto
    align-self stretch
    border-bottom 2px solid #e6ebeb
    display flex
    flex-direction column
    justify-content center
    align-items flex-start
    padding-right 10px
  & > .content > .title
    margin 0
    font-size 1.8em
    font-weight 400
    font-family $ff-demo-title
  & > .content > .summary
    margin 0
    font-size 1.4em
    color #8f8c95
    font-family $ff-demo-desc
</style>
