<template>
  <div class="demos" :class="[isDesktop ? 'desktop' : 'nodesktop']">
    <div class="title">{{ $t('caption') }}</div>
    <div class="categories">
      <Category
        v-for="c in categorys"
        :key="c.id"
        :id="c.id"
        :name="c.name"
        :demos="c.demos"
      />
    </div>
  </div>
</template>

<script>
import Category from './src/Category'
import { categorys } from './src/data'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      categorys: categorys,
    }
  },
  components: { Category },
  computed: {
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
  },
}
</script>

<style lang="stylus" scoped>
.demos
  display flex
  flex-direction column
  justify-content center
  align-content center
  & > .title
    font-family $ff-general
    font-weight 700
    color #007477
    align-self flex-start
  &.desktop
    margin 60px 65px 0px
    > .title
      font-size $fz-demos-title
      margin 0px 0px 20px 18px
  &.nodesktop
    margin 40px 0px 0px
    > .title
      font-size $fz-demos-nodesk-title
      margin 0px
      margin-left 30px
      margin-bottom 20px
  &.desktop > .categories
    display flex
    flex-direction row
    flex-wrap wrap
  &.nodesktop > .categories
    flex-direction column
</style>

<i18n>
{
  "en": {
    "caption": "Category"
  },
  "zh": {
    "caption": "分类"
  }
}

</i18n>