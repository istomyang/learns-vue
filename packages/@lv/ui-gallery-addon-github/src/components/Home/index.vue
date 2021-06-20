<template>
  <div>
    <v-overlay :value="dataInit" opacity=".1">
      <v-progress-circular
        :size="50"
        color="green"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
    <Bar @switcher="tellOpenNav" @tabs.self="tellTab" />
    <Nav :switcher="switcher" @choose.self="tellRepo" />
    <Content :reponame="reponame" :tab="tab" />
  </div>
</template>

<script>
import Bar from '../Bar'
import Nav from '../Nav'
import Content from '../Content'
// noinspection ES6CheckImport
import { Init } from '../../gql/user.gql'

// noinspection JSUnresolvedVariable
export default {
  name: 'home',
  data() {
    return {
      switcher: true,
      dataInit: false,
      reponame: '',
      tab: '',
    }
  },
  methods: {
    tellRepo(repo) {
      this.reponame = repo
    },
    tellTab(tab) {
      this.tab = tab
    },
    tellOpenNav() {
      this.switcher = !this.switcher
    },
  },
  provide() {
    return {
      username: this.username,
    }
  },
  props: ['username'],
  apollo: {
    $subscribe: {
      waitInit: {
        query: Init,
        result({ data }) {
          this.dataInit = data.waitInit
          this.$store.commit('github/addUsersHasData', this.username)
        },
      },
    },
  },
  created() {
    // for click avatar to enter in
    this.$store.getters['github/hasInUsersHasData'](this.username) &&
      (this.dataInit = true)
  },
  components: { Bar, Nav, Content },
}
</script>

<style scoped></style>
