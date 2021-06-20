import { gql } from 'apollo-server-koa'
import { DataApi } from '../data'
import { error } from 'console'
import { User, UserStatus } from '../types/user'
import { runAsyncAll } from '@lv/shared/common'
import { Channel, PSM } from '../pubSub'

export const typeDef = gql`
  extend type Query {
    # All login user, with simple info demanded
    allUserSimpleInfo: [UserSimpleInfo!]

    # One user with all profile info
    getProfileData(username: String): UserProfile
  }

  extend type Mutation {
    # Return URL to authorize
    login(username: String!, client_id: String, client_secret: String): String
    logout(username: String!): Boolean

    # init user data for viewer
    initDataTest(username: String!): JSONObject
  }

  extend type Subscription {
    waitToken: Boolean
    waitInit: Boolean
  }

  type UserSimpleInfo {
    name: String!
    login: String!
    avatar_url: String!
    bio: String
    location: String
    email: String
    html_url: String
  }

  type UserProfile {
    login: String!
    avatar_url: String!
    name: String!
    bio: String!
    location: String!
    email: String!
    html_url: String!
    public_repos: Int
    total_private_repos: Int
    followers: Int
    following: Int

    stars: [StarredRepoInfo]
  }

  type StarredRepoInfo {
    name: String
    description: String
    private: Boolean
    fork: Boolean
    fork_from: String
    stargazers_count: Int
    language: String
  }
`

export const resolver = {
  Query: {
    async allUserSimpleInfo(_, __, { dataApi }) {
      const api: DataApi = dataApi
      let result
      try {
        if (api.mode === 'full') {
          result = await api.mUser.getAllUserBasicInfo()
        }
      } catch (e) {
        error(e)
      }
      return result
    },
    async getProfileData(_, { username }, { dataApi }) {
      const api = dataApi as DataApi
      let result
      try {
        if (api.mode === 'full') {
          result = (
            await api.mUser.collection.findOne(
              { username },
              {
                projection: { profile: 1, _id: 0 },
              }
            )
          ).profile
        }
      } catch (e) {
        error(e)
      }
      return result
    },
  },
  Mutation: {
    /**
     * Set data when a user login, then return a redirect url to oauth
     *
     * spec:
     * 1. If login with same data in db, then switch user directly
     * 2. You must logoff user to drop user info data in db, then can login with new user
     */
    login: async (
      _,
      { username, client_id, client_secret },
      { dataApi, Psm }
    ) => {
      const api: DataApi = dataApi
      const psm: PSM = Psm

      const isGuest = !client_id

      // handle font-end data
      const data = {
        username,
        status: isGuest ? UserStatus.login : UserStatus.oauth,
        oauth: isGuest
          ? { client_id: '', client_secret: '' }
          : { client_id, client_secret },
      } as User

      try {
        if (api.mode === 'full') {
          await runAsyncAll(
            api.mUser.setNewLoginUser(data),
            api.localer.setNewLoginUser(data)
            // eslint-disable-next-line @typescript-eslint/no-empty-function
          )
        }
      } catch (e) {
        throw e
      }

      const port = 4000

      let scope

      if (isGuest) {
        api.initUserData(username).then(() => {
          psm.emit(Channel.INIT)
        })
      } else {
        scope =
          'scope=repo%20repo:status%20public_repo%20gist%20notifications%20user%20read:user'
      }

      return isGuest
        ? ''
        : `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost:${port}/authorize&state=istomyang&login=${username}&${scope}`
    },

    logout: async (_, { username }, { dataApi }) => {
      const api: DataApi = dataApi
      try {
        if (api.mode === 'full') {
          return await api.mUser.delUserInfo(username)
        }
      } catch (e) {
        throw e
      }
      return true
    },

    initDataTest: async (_, { username }, { dataApi }) => {
      try {
        const api: DataApi = dataApi
        await api.initUserDataTest(username)
        return api.localer.collection.find({ username }).value()
      } catch (e) {
        throw e
      }
    },
  },
  Subscription: {
    waitToken: {
      subscribe: (_, __, { Psm }) => {
        return (Psm as PSM).pubSub.asyncIterator([Channel.TOKEN])
      },
    },

    waitInit: {
      subscribe: (_, __, { Psm }) => {
        return (Psm as PSM).pubSub.asyncIterator([Channel.INIT])
      },
    },
  },
}
