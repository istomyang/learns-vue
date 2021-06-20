<template>
  <div class="note">
    <div class="title">{{ $t('noteinfo.title') }}</div>
    <div class="description">{{ $t('noteinfo.description') }}</div>
  </div>
</template>

<script>
export default {
  inject: ['info_data'],
  data() {
    return {
      data: this.info_data.note,
    }
  },
  created() {
    this.$i18n.mergeLocaleMessage('zh', {
      noteinfo: {
        title: this.data.title.zh,
        description: this.data.description.zh,
      },
    })
    this.$i18n.mergeLocaleMessage('en', {
      noteinfo: {
        title: this.data.title.en,
        description: this.data.description.en,
      },
    })
  },
}
</script>

<style lang="stylus" scoped>
.note
  position absolute
  height 100%
  // 固定宽度不会导致宽度减少时文字折行
  width 450px
  padding 0px 60px
  display flex
  flex-direction column
  .title
    flex 0 0 auto
    font-family $ff-d-title
    font-size $fz-d-title
    font-weight 400
    margin 30px 0px 20px
  .description
    font-family $ff-d-description
    font-size $fz-d-description
    white-space pre-line
</style>