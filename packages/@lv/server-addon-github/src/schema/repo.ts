import { gql } from 'apollo-server-koa'
import { DataApi } from '../data'
import { error } from 'console'
import { Repo, File } from '../types/user'

export const typeDef = gql`
  extend type Query {
    getUserReposFullName(username: String!): [String!]

    getUserRepos(username: String!): [RepoInfo]

    # one user's basic repos info
    getUserRepo(repoFullName: String!): RepoInfo

    # Get tree layer, called when click a folder
    getTreeLayer(uri: String): [JSONObject]

    # Get repo readme
    getReadMe(repoFullName: String!): JSON

    # Get file content, if markdown, has html
    getFileContent(uri: String!, type: String): JSON
  }

  type RepoInfo {
    #vue
    name: String!
    #vuejs
    login: String!
    #vuejs/vue
    fullname: String!
    private: Boolean!
    fork: Boolean
    description: String
    homepage: String
    stargazers_count: Int
    language: String
    forks_count: String
    watchers_count: String
    license: String
    forked_from: String
    branches: [JSONObject]
  }
`

export const resolver = {
  Query: {
    async getUserReposFullName(
      _,
      { username },
      { dataApi }
    ): Promise<string[]> {
      const api: DataApi = dataApi
      let result: string[]
      try {
        if (api.mode === 'full') {
          result = (
            await api.mUser.collection.findOne(
              { username },
              {
                projection: { repos: 1, _id: 0 },
              }
            )
          ).repos.map(repo => repo.fullname)
        }
      } catch (e) {
        error(e)
      }
      return result
    },
    async getUserRepos(_, { username }, { dataApi }): Promise<Repo[]> {
      const api: DataApi = dataApi
      let result: Repo[]
      try {
        if (api.mode === 'full') {
          result = (
            await api.mUser.collection.findOne(
              { username },
              {
                projection: { repos: 1, _id: 0 },
              }
            )
          ).repos
        }
      } catch (e) {
        error(e)
      }
      return result
    },
    async getUserRepo(_, { repoFullName }, { dataApi }): Promise<Repo> {
      const api: DataApi = dataApi
      let result: Repo
      try {
        if (api.mode === 'full') {
          result = (
            await api.mUser.collection.findOne(
              { 'repos.fullname': repoFullName },
              {
                projection: { repos: 1, _id: 0 },
              }
            )
          ).repos.find(repo => repo.fullname === repoFullName)
        }
      } catch (e) {
        error(e)
      }
      return result
    },
    async getTreeLayer(_, { uri }, { dataApi }): Promise<File[]> {
      const api: DataApi = dataApi
      try {
        return await api.neter.getTreeLayer(uri)
      } catch (e) {
        throw e
      }
    },
    async getReadMe(_, { repoFullName }, { dataApi }): Promise<string> {
      const api: DataApi = dataApi
      let result: string
      try {
        result = await dataApi.mCache.getCache(repoFullName)
        if (!result) {
          result = await api.neter.getReadMe(repoFullName)
          await api.mCache.setCache(repoFullName, result)
        }
      } catch (e) {
        throw e
      }
      return result
    },
    async getFileContent(_, { uri, type }, { dataApi }): Promise<string> {
      const api: DataApi = dataApi
      type = type || ''
      let result: string
      try {
        result = await dataApi.mCache.getCache(uri)
        if (!result) {
          const getF = /(markdown|md|Markdown)/.test(type)
            ? api.neter.getMarkDownHtml
            : api.neter.getFile
          result = await getF.call(api.neter, uri)
          api.mCache.setCache(uri, result).then()
        }
      } catch (e) {
        throw e
      }
      return result
    },
  },
}
