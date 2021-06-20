<!--suppress ALL -->
<template>
  <v-app-bar app clipped-left>
    <!-- Github Icon -->
    <v-app-bar-nav-icon
      @click="
        $router.replace({
          name: 'github_home',
          params: { username: this.username },
        })
      "
    >
      <svg height="32" width="32" viewBox="0 0 16 16" version="1.1">
        <path
          fill-rule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
        ></path>
      </svg>
    </v-app-bar-nav-icon>

    <v-btn icon @click="$emit('switcher')">
      <v-icon large>mdi-bookshelf</v-icon>
    </v-btn>

    <!-- TODO: Search global repos-->
    <v-autocomplete
      v-model="query"
      :loading="isLoading"
      auto-select-first
      clearable
      filled
      dense
      rounded
      hide-details
      hide-no-data
      single-line
      append-icon="mdi-slash-forward-box"
      label="Enter repo you want to Go!"
      :items="items"
      :search-input.sync="search"
    ></v-autocomplete>

    <v-tabs class="vtabs">
      <v-tab @click="$emit('tabs', 'pop')">
        <v-icon left>book-open-page-variant</v-icon>
        Overview
      </v-tab>
      <v-tab @click="$emit('tabs', 'all')">
        <v-icon left>book-multiple </v-icon>
        <v-badge color="green" content="6">Repositories</v-badge>
      </v-tab>
    </v-tabs>

    <OnProgress v-slot="{ on, attrs }">
      <!-- route to notification page -->
      <!-- https://github.com/notifications -->
      <v-btn icon v-bind="attrs" v-on="on">
        <v-badge overlap dot>
          <v-icon> mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </OnProgress>

    <!-- TODO: Repos' handle-->
    <v-menu>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon> mdi-plus</v-icon>
          <v-icon class="icon-20"> mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <OnProgress v-slot="{ on, attrs }">
          <!-- TODO: route-->
          <v-list-item
            v-for="(item, i) in menu_adds"
            :key="i"
            v-bind="attrs"
            v-on="on"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </OnProgress>
      </v-list>
    </v-menu>

    <v-menu offset-y :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-avatar size="26" v-if="true"
            ><img
              :src="
                avatar_url ||
                'https://avatars.githubusercontent.com/u/67993732?v=4'
              "
              alt=""
          /></v-avatar>
          <v-icon v-else> mdi-face-woman</v-icon>
        </v-btn>
      </template>
      <!--User info card show-->
      <v-card class="mx-auto" outlined>
        <v-container>
          <v-row align="stretch" justify="start">
            <!--left-->
            <UserInfo />
          </v-row>
        </v-container>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import UserInfo from './userInfo'
import { SearchRepos } from '../../gql/repo.gql'
import { GetAvatarUri } from '../../gql/user.gql'
import { gen_userInfo } from '../Login/gen'
import OnProgress from '../OnProgress'

export default {
  name: 'app-bar.vue',
  data() {
    return {
      // 搜索项目
      isLoading: false,
      items: [],
      search: null,
      query: null,
      // 新增的选项
      // TODO: add router
      menu_adds: [{ title: 'New Repo', route: { name: '' } }],
    }
  },
  props: ['dataHasGet'],
  inject: ['username'],
  apollo: {
    avatar_url: {
      query: GetAvatarUri,
      variables() {
        return { username: this.username }
      },
      update: data => data.getProfileData.avatar_url,
    },
  },
  watch: {
    search(val) {
      // TODO: query graphql
      // send query data to server, server query github rest server
      // https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-for-repositories#search-by-repository-name-description-or-contents-of-the-readme-file
      // https://docs.github.com/en/rest/reference/search#search-repositories

      this.$apollo
        .mutate({
          mutation: SearchRepos,
          variables: {
            q: this.query,
          },
        })
        .then(data => {
          console.log(data)
          // TODO: json: ['vue/vuejs']
          const repos = data.data.searchRepos.body
          this.items = repos
        })
        .catch(err => {
          this.error_msg = err.message
          this.error = true
        })
    },
  },
  components: { UserInfo, OnProgress },
}
</script>

<style lang="sass" scoped>
.vtabs
  width: 500px
</style>
