<template>
  <div class="options">
    <div class="title">{{ $t('optioninfo.title') }}</div>
    <div class="opts">
      <OB
        v-for="opt in data"
        :selected.sync="selected"
        :key="opt.key"
        :id="opt.id"
        :first="data[0].id"
        >{{ $t(`optioninfo.names.${opt.id}`) }}</OB
      >
    </div>
  </div>
</template>

<script>
import OB from './OptionButton'

export default {
  data() {
    return {
      data: this.info_data.options,
      selected: this.info_data.options[0].id,
    }
  },
  components: { OB },
  inject: ['info_data'],
  created() {
    let zh = { optioninfo: { title: '选项', names: {} } }
    let en = { optioninfo: { title: 'Options', names: {} } }

    this.data.forEach(opt => {
      zh.optioninfo.names[opt.id] = opt.name.zh
      en.optioninfo.names[opt.id] = opt.name.en
    })

    this.$i18n.mergeLocaleMessage('zh', zh)
    this.$i18n.mergeLocaleMessage('en', en)
  },
}
</script>

<style lang="stylus" scoped>
.options
  height 100%
  display flex
  flex-direction column
  align-items stretch
  padding 0px 60px
  .title
    flex 0 0 auto
    font-family $ff-d-title
    font-size $fz-d-title
    font-weight 400
    padding-left 20px
    margin 30px 0px 3px
    border-bottom 2px solid #030303
  .opts
    flex 1 1 auto
    display flex
    justify-content flex-start
    flex-direction column
    align-items stretch
</style>