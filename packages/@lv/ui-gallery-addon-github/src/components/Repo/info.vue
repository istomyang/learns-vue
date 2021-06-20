<template>
  <div>
    <div>
      <div class="wrapper-col">
        <p class="text-subtitle-1">{{ info.login }}</p>
        <p class="text-h5">{{ info.name }}</p>
        <p class="text-body-1">{{ info.description }}</p>
        <div class="wrapper-row">
          <v-select
            v-model="select"
            :items="branches"
            item-text="name"
            label="Select"
            persistent-hint
            return-object
            single-line
          ></v-select>
          <v-btn @click="emitBranch" class="btn-left">Open</v-btn>
        </div>
      </div>
    </div>
    <div v-html="html" class="text-body-1"></div>
  </div>
</template>

<!--suppress ES6CheckImport -->
<script>
import { GetRepoInfo, GetRepoReadMe } from '../../gql/repo.gql'
import { NetworkStatus } from 'apollo-client'

export default {
  name: 'info',
  data() {
    return {
      select: null,
      html: '',
      info: {
        login: '',
        name: '',
        description: '',
      },
      branches: [],
    }
  },
  props: ['reponame'],
  methods: {
    emitBranch() {
      this.$emit('branch', this.select)
    },
    getInfo(val) {
      this.$apollo
        .query({
          query: GetRepoInfo,
          variables: {
            reponame: val,
          },
        })
        .then(({ data, loading, networkStatus }) => {
          if (networkStatus === NetworkStatus.error) {
            this.branches = ['Error']
            this.select = this.branches[0]
            this.info = {
              login: 'Error',
              name: 'Error',
              description: 'Net Error',
            }
          }
          if (!loading) {
            const r = data.getUserRepo
            if (!r) throw new Error('Rep::Info is null')
            this.branches = r.branches
            this.select = this.branches[0]
            this.info = r
          }
        })
        .catch(e => {
          throw e
        })
    },
    getReadMe(val) {
      this.$apollo
        .query({
          query: GetRepoReadMe,
          variables: {
            reponame: val,
          },
        })
        .then(({ data, loading }) => {
          if (!loading) this.html = data.getReadMe
        })
        .catch(e => {
          throw e
        })
    },
  },
  watch: {
    reponame(val, old) {
      if (val === old) return
      this.getInfo(val)
      this.getReadMe(val)
    },
  },
  created() {
    this.getInfo(this.reponame)
    this.getReadMe(this.reponame)
  },
}
</script>

<style lang="stylus" scoped>
.wrapper-row
  display flex
  flex-direction row
  justify-content space-between
  align-items center

.btn-left
  margin-left 30px
</style>
