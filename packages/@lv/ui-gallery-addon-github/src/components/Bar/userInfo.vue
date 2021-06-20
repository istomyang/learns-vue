<!--suppress ALL -->

<template>
  <v-col class="flex-grow-0">
    <v-container>
      <v-row justify="center" align="center" class="mb-1">
        <v-avatar size="192"
          ><img
            :src="
              profile.avatar_url ||
              'https://avatars.githubusercontent.com/u/67993732?v=4'
            "
            alt=""
        /></v-avatar>
      </v-row>

      <v-row>
        <v-card class="mx-auto" outlined max-width="500">
          <v-card-title> {{ profile.name || 'Tom Yang' }} </v-card-title>
          <v-card-subtitle>
            {{ profile.login || 'istomyang' }}
          </v-card-subtitle>
          <v-card-text>{{ profile.bio }}</v-card-text>
          <v-card-actions>
            <v-btn block elevation="3" color="primary">Edit Profile </v-btn>
          </v-card-actions>

          <v-card-actions>
            <v-btn rounded text>
              <v-icon left small>mdi-account-group</v-icon>
              {{ profile.followers }} Followers
            </v-btn>
            <span>-</span>

            <v-btn rounded text>{{ profile.following }} Following</v-btn>
            <span>-</span>

            <v-btn rounded text>
              <v-icon left small>mdi-heart</v-icon>
              {{ profile.stars.length }}
            </v-btn></v-card-actions
          >

          <v-card-text>
            <v-icon left>mdi-map-marker</v-icon>
            {{ profile.location || 'JiangSu, China' }}
          </v-card-text>

          <v-card-text>
            <v-btn text>
              <v-icon left>mdi-email </v-icon>
              {{ profile.email || 'istomyang@gmail.com' }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </v-col>
</template>

<script>
import { GetProfile } from '../../gql/user.gql'

export default {
  name: 'user-info',
  apollo: {
    profile: {
      query: GetProfile,
      variables() {
        return { username: this.username }
      },
      update: data => {
        console.log(data)
        return data.getProfileData
      },
    },
  },
  inject: ['username'],
}
</script>

<style scoped></style>
