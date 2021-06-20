<!--suppress ALL -->
<template>
  <v-container class="fill-height">
    <v-form class="form-move">
      <v-container>
        <v-row>
          <v-col class="no-padding">
            <v-subheader class="inset_zero">已登陆</v-subheader>
            <div class="avatar_list">
              <!--suppress JSUnresolvedVariable -->
              <div
                v-for="user in loginUsers"
                :key="user.login"
                class="avatar"
                @click="enterHome(user.login)"
              >
                <v-avatar size="56" class="right-margin-avatar" color="primary">
                  <img
                    v-if="user.avatar_url"
                    :src="user.avatar_url"
                    :alt="user.name"
                  />
                  <span v-else class="white--text text-h5">{{
                    user.name
                  }}</span>
                </v-avatar>
                <span>{{ user.name }}</span>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" class="no-padding">
            <v-text-field
              v-model="username"
              :rules="[nameRules]"
              :counter="20"
              label="User Name"
              hint="Your username of Github"
              required
              clearable
              prepend-icon="mdi-face"
              filled
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="auto" class="no-padding">
            <v-text-field
              v-model="client_id"
              :rules="[idRules]"
              label="Client Id"
              required
              clearable
              hint="id of your OAuth setting"
              prepend-icon="mdi-key"
              filled
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="auto" class="no-padding">
            <v-text-field
              v-model="client_secret"
              :rules="[secretRules]"
              label="Client Secret"
              hint="secret of your OAuth setting"
              required
              clearable
              prepend-icon="mdi-form-textbox-password"
              filled
            ></v-text-field
          ></v-col>
        </v-row>

        <v-row class="center-end">
          <v-col cols="auto" class="no-padding">
            <v-btn elevation="2" small color="primary" @click="submit"
              >Login
              <v-icon right>mdi-login</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <!--  -->
    <v-dialog v-model="error" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Login Error
        </v-card-title>
        <v-card-text>
          {{ error_msg }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="error = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<!--suppress ES6CheckImport -->
<script>
import { gen_userInfo } from './gen'
import { Login, Token, GetLoginUserList } from '../../gql/user.gql'

// noinspection SpellCheckingInspection
export default {
  data: () => ({
    username: 'istomyang',
    client_id: '',
    client_secret: '',
    error: false,
    error_msg: '',
    // window handle
    oauth_window: null,
  }),
  apollo: {
    loginUsers: {
      query: GetLoginUserList,
      update(data) {
        const result = data.allUserSimpleInfo
        const nameList = result.map(u => u.login)
        this.$store.commit('github/addUsersHasData', nameList)
        if (result.length === 1) {
          const a = [1, 2, 3, 4]
          a.forEach(i => {
            result.push({
              name: `T${i}`,
              login: `test${i}`,
            })
          })
        }
        return result
      },
      pollInterval: 5000,
    },
    $subscribe: {
      waitToken: {
        query: Token,
        result({ data }) {
          const _r = data.waitToken
          if (_r) {
            this.oauth_window.close()
            this.$router.replace({
              name: 'github_home',
              params: { username: this.username },
            })
          }
        },
      },
    },
  },

  methods: {
    enterHome(username) {
      this.$store.commit('github/updateCurrentUser', this.username)
      this.$router.replace({
        name: 'github_home',
        params: { username: this.username },
      })
    },
    submit() {
      this.$apollo
        .mutate({
          mutation: Login,
          variables: {
            username: this.username,
            client_id: this.client_id,
            client_secret: this.client_secret,
          },
        })
        .then(data => {
          this.$store.commit('github/updateCurrentUser', this.username)
          const uri = data.login
          if (!!uri) {
            // oauth user
            this.oauth_window = window.open(uri)
          } else {
            this.$router.replace({
              name: 'github_home',
              params: { username: this.username },
            })
          }
        })
        .catch(err => {
          this.error_msg = err.message
          this.error = true
        })
    },
    // TODO: Validate
    nameRules() {
      return true
    },
    idRules() {
      return true
    },
    secretRules() {
      return true
    },
  },
}
</script>

<style scoped>
/*.all-center {*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*}*/
.center-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.fill-height {
  justify-content: center;
}
.no-padding {
  padding: 0 !important;
}
.form-move {
  margin-bottom: 20px;
}
.inset_zero {
  padding-left: 0 !important;
}
.right-margin-avatar {
  margin-right: 10px;
}

.avatar {
  width: 76px;
  font-size: 16px;
  font-family: 'Open Sans', 'Noto Sans SC', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.avatar_list {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>
