<template>
  <v-container style="max-width: none">
    <v-subheader class="text-h5">{{ title }}</v-subheader>
    <v-row>
      <v-item-group class="a" v-model="selectedIndex">
        <v-container style="max-width: none">
          <v-row justify="start" align="start">
            <!--suppress JSUnresolvedVariable -->
            <v-col v-for="repo in repos" :key="repo.name" cols="4">
              <v-item v-slot="{ toggle }">
                <v-card
                  class="mx-auto"
                  @click="toggle"
                  elevation="3"
                  min-width="200"
                >
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="text-h5 mb-1">
                        {{ repo.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ repo.description }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-subtitle>
                      {{ repo.language }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
    </v-row>
  </v-container>
</template>

<!--suppress ES6CheckImport -->
<script>
import { GetStarRepoInfo } from '../../gql/user.gql'
import { GetUserRepos } from '../../gql/repo.gql'

export default {
  // Popular repo
  name: 'overview',
  data() {
    return {
      repos: null,
      title: '',
      selectedIndex: null,
      first: false,
    }
  },
  // tab: overview/repos
  props: ['tab'],
  inject: ['username'],
  watch: {
    selectedIndex(val, old) {
      if (val === old) return
      if (this.tab === 'overview') return
      this.$emit('choose', this.repos[this.selectedIndex].fullname)
    },
    tab(val) {
      if (val === '') this.repos = null

      if (val === 'first' && val === 'pop') {
        this.initPop().catch(e => {
          throw e
        })
      }

      if (val === 'all') {
        this.$apollo
          .query({
            query: GetUserRepos,
            variables: {
              username: this.username,
            },
          })
          .then(({ data }) => {
            // has fullname
            this.repos = data.getUserRepos
            this.title = 'All repositories'
          })
          .catch(e => {
            throw e
          })
      }
    },
  },
  methods: {
    initPop() {
      this.$apollo
        .query({
          query: GetStarRepoInfo,
          variables: {
            username: this.username,
          },
        })
        .then(({ data }) => {
          const r = data.getProfileData.stars

          this.repos = r.map(repo => {
            const result = repo
            result['fullname'] = `${this.username}/${repo.name}`
            return result
          })
          this.title = 'Popular repositories'
        })
        .catch(e => {
          throw e
        })
    },
  },
  created() {
    if (!this.first) {
      this.initPop()
      this.first = true
    }
  },
}
</script>

<style lang="sass" scoped>
//.a
//  height: calc(100vh - 64px - 50px)
//  overflow-y: scroll
</style>
