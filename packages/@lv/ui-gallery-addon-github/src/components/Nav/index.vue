<template>
  <v-navigation-drawer app clipped v-model="switching" absolute width="320">
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col>
          <v-subheader>Repos</v-subheader>
        </v-col>
        <v-col style="direction: rtl">
          <!-- TODO: New repo -->
          <OnProgress v-slot="{ attrs, on }">
            <v-btn color="primary" elevation="2" small v-bind="attrs" v-on="on">
              <v-icon right>mdi-book</v-icon>
              New
            </v-btn>
          </OnProgress>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!--suppress JSUnresolvedVariable -->
          <v-autocomplete
            v-model="selected"
            :items="reposName"
            :search-input.sync="searchRepo"
            auto-select-first
            clearable
            filled
            dense
            hide-details
            hide-no-data
            single-line
            label="Search repos"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-list dense>
          <v-list-item-group v-model="selectedIndex" color="primary">
            <!--suppress JSUnresolvedVariable -->
            <v-list-item v-for="repo in reposName" :key="repo">
              <v-list-item-icon>
                <v-icon>mdi-book-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ repo }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <v-card outlined>
      <v-card-title>@lv-Github</v-card-title>
      <v-card-text>Github SPA power by Vuetify</v-card-text>
      <v-card-actions>
        <v-container>
          <v-row justify="center" align="center">
            <v-btn
              color="primary"
              elevation="3"
              width="200"
              href="https://vuetifyjs.com/zh-Hans/"
            >
              See Vuetify
            </v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
import OnProgress from '../OnProgress'
// noinspection ES6CheckImport
import { GetReposList } from '../../gql/repo.gql'

export default {
  name: 'nav.vue',
  props: ['switcher'],
  data: () => {
    return {
      searchRepo: null,
      selected: '',
      selectedIndex: 1,
      switching: true,
    }
  },
  watch: {
    selected(val, old) {
      if (val === old) return
      this.$emit('choose', val)
    },
    selectedIndex(val, old) {
      if (val === old) return
      this.$emit('choose', this.reposName[val])
    },
    switcher(val, old) {
      if (val === old) return
      this.switching = this.switcher
    },
  },
  inject: ['username'],
  components: { OnProgress },
  apollo: {
    reposName: {
      query: GetReposList,
      variables() {
        return { username: this.username }
      },
      update: data => data.getUserReposFullName,
    },
  },
}
</script>

<style scoped></style>
