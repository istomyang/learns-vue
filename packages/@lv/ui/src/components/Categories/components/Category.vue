<template>
  <div class="category" :class="[isDesktop ? 'desktop' : 'nodesktop']">
    <div class="title-bar" @click="switching" :class="{ expanded: expanded }">
      <!-- <div class="pre"></div> -->
      <img :src="icon" alt="" class="pre" />
      <p class="title">{{ $t('category.name') }}</p>
      <div class="down-arrow" v-show="expanded" />
    </div>
    <transition name="list">
      <div class="body" v-show="expanded">
        <Item
          v-for="d in demos"
          :id="d.id"
          :key="d.key"
          :name="d.name"
          :summary="d.summary"
          :icon="d.icon"
          :categoryid="id"
          :previewsId="d.previewsId"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Item from './Item'
export default {
  props: ['id', 'name', 'demos', 'icon'],
  data() {
    return {
      expanded: false,
    }
  },
  methods: {
    switching() {
      if (!this.isDesktop) this.expanded = !this.expanded
    },
  },
  computed: {
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
  },
  watch: {
    // 动态调整窗口尺寸
    isDesktop(val) {
      if (!!val) {
        this.expanded = true
      } else {
        this.expanded = false
      }
    },
  },
  created() {
    this.$i18n.mergeLocaleMessage('zh', {
      category: {
        name: this.name.zh,
      },
    })
    this.$i18n.mergeLocaleMessage('en', {
      category: {
        name: this.name.en,
      },
    })
  },
  mounted() {
    if (this.isDesktop) this.expanded = true
  },
  components: { Item },
}
</script>

<style lang="stylus" scoped>
.category
  display flex
  flex-direction column
  justify-content flex-start
  align-items stretch
  cursor pointer
  & .title-bar
    background-color #ffffff
    flex 1 1 auto
    padding-left 16px
    display flex
    flex-direction row
    align-items center
    justify-content flex-start
    & > .pre
      flex 0 0 auto
    & > .title
      font-family $ff-group-title
      font-weight 400
      margin 0px 10px
  & .title-bar:hover
    background-color #f5f5f5

.category.desktop
  margin 0px 10px 25px
  flex 1 1 auto
  width 400px
  // 不需要min-width，有nodesktop
  max-width 448px
  & .title-bar
    border-top-left-radius 10px
    border-top-right-radius 10px
    height 100px
    & > .pre
      height 54px
      width 54px
    & > .title
      font-size $fz-demos-nodesk-category
    & > .down-arrow
      display none
  & .expanded
    border-bottom 2px solid #ebefef

.category.nodesktop
  flex 1 1 auto
  margin 0px 0px 10px
  .title-bar
    transition all 0.3s ease-out
    border-radius 10px
    height 80px
    margin 0px 30px
    .pre
      height 52px
      width 52px
    .title
      font-size $fz-demos-nodesk-category
    .down-arrow
      display none
  .expanded
    margin 0px
    border-radius 0px
  .down-arrow
    margin 0px
    margin-right 20px
    margin-left auto
    width 10px
    height 10px
    border-left 3px solid red
    border-top 3px solid red
    border-right-color transparent
    border-bottom-color transparent
    transform rotate(45deg)
    margin-top 3px

.body
  background-color #ffffff
  border-bottom-left-radius 10px
  border-bottom-right-radius 10px
  margin-top 0px
  padding-bottom 10px
  display flex
  flex-direction column
  justify-content flex-start
  align-items stretch
  height 610px
  overflow scroll
  --ms-overflow-style none
  scrollbar-width none
  &::-webkit-scrollbar
    display none

.list-enter-active, .list-leave-active
  transition all 0.3s ease

.list-enter, .list-leave-to
  // opacity 0
  height 0
  margin 0px 30px
</style>

<i18n>
{
  "en": {
    "category": {
      "weight": "Weight",
      "layout": "Layout",
      "lib": "Library"
    }
  },
  "zh": {
    "category": {
      "weight": "组件",
      "layout": "布局",
      "lib": "库"
    }
  }
}

</i18n>
