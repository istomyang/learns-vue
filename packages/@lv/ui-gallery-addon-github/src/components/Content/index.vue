<template>
  <v-main app class="my-container">
    <div class="content">
      <Tab v-if="tabShow" :tab="reallyTab" @choose.self="chooseRepo" />
      <Repo v-else :reponame="reallyRepo" />
    </div>
  </v-main>
</template>

<script>
import Tab from './tab'
import Repo from '../Repo'

export default {
  name: 'Content',
  data() {
    return {
      tabShow: true,
      reallyRepo: '',
      reallyTab: '',
    }
  },
  /**
   * default is ''
   * reponame: 'abc/def', tab: 'all' 'pop'
   * note: is tabShow is switch, clear other status
   * */
  props: ['reponame', 'tab'],
  watch: {
    tab(val, old) {
      this.reallyTab = val
      this.reallyRepo = ''
      this.tabShow = true
      if (val === old) return
    },
    reponame(val, old) {
      this.reallyTab = ''
      this.reallyRepo = val
      this.tabShow = false
      if (val === old) return
    },
  },
  methods: {
    chooseRepo(val) {
      this.reallyRepo = val
      this.reallyTab = ''
    },
  },
  components: { Tab, Repo },
}
</script>

<style lang="stylus" scoped>
.content
  height: calc(100vh)
  overflow-y: scroll
  padding 40px
</style>
