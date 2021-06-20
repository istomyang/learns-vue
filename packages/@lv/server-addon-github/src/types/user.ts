// https://juejin.cn/post/6844903749501059085

/**
 * User单用户数据形状
 * 若需要后期修改，需要再次同步。
 */

export type Users = {
  [username: string]: User
}

export type User = {
  username: string
  status: UserStatus
  oauth?: OAuth
  profile?: Profile
  repos?: Repo[]
}

export interface LoginUserBasicInfo {
  name: string
  login: string
  avatar_url: string
  bio?: string
  location?: string
  email?: string
  html_url: string
}

export enum UserStatus {
  // 正在验证
  oauth = 'oauth',
  // 登陆到后台，保留数据
  login = 'login',
}

export interface OAuth {
  client_id: string
  client_secret: string
  token?: string
}

export interface Profile {
  login: string
  avatar_url: string
  name: string
  bio: string
  location: string
  email: string
  html_url: string
  public_repos: number
  total_private_repos: number
  followers: number
  following: number

  update_time?: string

  // addon
  stars?: StarredRepoInfo[]
}

// 简单的用于前端显示的数据
export interface StarredRepoInfo {
  name: string
  description?: string
  private?: Boolean
  fork?: Boolean
  fork_from?: string
  stargazers_count?: Number
  language?: string
}

export interface Repo {
  // username
  login: string
  // reponame
  name: string
  fullname: string
  private: boolean
  fork: boolean
  description: string
  homepage: string
  stargazers_count: number
  language: string
  forks_count: string
  watchers_count: string
  license: string

  update_time?: string

  forked_from?: string
  branches: Branch[]
}

export interface Branch {
  name: string
  uri: string
  node?: File[]
}

// 包含文件和文件夹的数据类型
export interface RawNode {
  // package.json or src
  name: string
  // uri = repo_uri + suffix
  // use url as key of cache
  // note: raw is https://xxxxxxxxxxxx, store will dePrefix
  uri: string
}

export interface File extends RawNode {
  // When  type === tree,
  node?: File[] | boolean
  // 1. When get uri to fetch, then update time
  // 2. When get content from cache, then check time
  update_time?: string
}
