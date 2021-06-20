import { RESTDataSource, HTTPCache } from 'apollo-datasource-rest'

import {
  deUrlPrefix,
  filterObject,
  Flag,
  injectFlags,
  pick,
  genArrayForAsync,
  runAsyncAll,
  runAsyncArray,
} from '@lv/shared/common'
import { highlight, print } from '@lv/shared/node'

import {
  Branch,
  File,
  Profile,
  Repo,
  StarredRepoInfo,
  User,
} from '../types/user'

/**
 * REST-Graphql Api
 *
 * strategy
 * 1. All apis modifies a full User object instead of return data.
 *    Because some data need this strategy.
 *
 * > https://github.com/apollographql/apollo-server/tree/main/packages/apollo-datasource-rest
 */
export class Neter extends RESTDataSource {
  constructor() {
    super()
    this.httpCache = new HTTPCache()
    this.baseURL = 'https://api.github.com/'
  }

  /**
   * Inject Profile data to User
   * @param attach Attach data to User
   * TODO: Error Log system!
   */
  async injectUserProfile(attach: User) {
    const getUserProfile = async (attach: User) => {
      const profile_fc =
        'login,avatar_url,name,bio,location,email,html_url,public_repos,total_private_repos,followers,following'

      try {
        const token = attach.oauth.token
        let __profile
        if (token) {
          // curl \
          // -H "Accept: application/vnd.github.v3+json" \
          // https://api.github.com/users/istomyang
          __profile = await this.get('user', null, {
            headers: {
              Authorization: attach.oauth.token,
              Accept: 'application/vnd.github.v3+json',
            },
          })
        } else {
          __profile = await this.get(`users/${attach.username}`, null, {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          })
        }

        // use source figure, don't need pick
        let _tmp = filterObject(__profile, profile_fc) as Profile

        // 更新完资源，打上标记
        injectFlags(_tmp, Flag.update)

        attach.profile = _tmp

        __profile = null
        _tmp = null
      } catch (error) {
        throw error
      }
    }
    const getUserProfileStars = async (attach: User) => {
      const username = attach.username
      const star_fc =
        'name,description,private,fork,fork_from,stargazers_count,language'

      try {
        // curl \
        //   -H "Accept: application/vnd.github.v3+json" \
        //   https://api.github.com/users/istomyang/starred
        let __stars = await this.get(`/users/${username}/starred`, null, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        })

        let _tmp_stars = []
        for (let s of __stars) {
          _tmp_stars.push(filterObject(s, star_fc) as StarredRepoInfo)
        }

        attach.profile.stars = _tmp_stars

        __stars = null
        _tmp_stars = null
      } catch (error) {
        throw error
      }
    }

    try {
      await getUserProfile(attach)
      await getUserProfileStars(attach)
      print('profile data is ok!', 3, 'Initialize')
    } catch (error) {
      throw error
    }
  }

  /**
   * Inject User's repo data
   *
   * I only store file maps without file content, these data will store in Db and
   * Local. If File Explorer is open, those use file uri to fetch content.
   *
   * In file content cache, also maintain a data object, which schema is:
   * { [filePathUri:string] :fileContentString }
   * */
  async injectUserRepos(attach: User) {
    let headers = { Accept: 'application/vnd.github.v3+json' }
    const username = attach.username
    const token = attach.oauth.token || false
    let path
    if (token) {
      path = `/user/repos`
      headers['Authorization'] = token
    } else {
      path = `/users/${username}/repos`
    }

    // noinspection SpellCheckingInspection
    const filtercode =
      'name,full_name,owner.login,private,fork,description,homepage,stargazers_count,watchers_count,language,forks_count,license.spdx_id,watchers_count'
    const schemaFigure = {
      login: 'owner.login',
      name: 'name',
      fullname: 'full_name',
      private: 'private',
      fork: 'fork',
      description: 'description',
      homepage: 'homepage',
      stargazers_count: 'stargazers_count',
      language: 'language',
      forks_count: 'forks_count',
      watchers_count: 'watchers_count',
      license: 'license.spdx_id',
    }

    const injectForkFrom = async (o: Repo) => {
      if (!o.fork) return
      let path = o.fullname
      const filtercode = 'parent.full_name'
      try {
        let r: object = await this.get(`/repos/${path}`, null, {
          headers,
        })

        o.forked_from = (filterObject(r, filtercode) as any)!.parent!
          .full_name as string
      } catch (e) {
        throw e
      }
    }

    const injectBranchesInfo = async (o: Repo) => {
      const fullname = o.fullname
      let branchpath = `/repos/${fullname}/branches`

      try {
        // curl \
        // -H "Accept: application/vnd.github.v3+json" \
        // https://api.github.com/repos/vuejs/vue/branches
        let rawBranches: Object[] = await this.get(branchpath, null, {
          headers,
        })
        const branchfc = 'name,commit.sha'
        const schema = {
          name: 'name',
          uri: () => [
            'commit.sha',
            (sha: string) => `/repos/${fullname}/git/trees/${sha}`,
          ],
        }

        // 403 rate limit
        // get master branch
        // let target = branches.find(b => b.name === 'master')
        // if (!target) target = branches[0]
        //
        // target.node = await this.getTreeLayer(target.uri)

        o.branches = rawBranches.map(rawBranch => {
          return pick(filterObject(rawBranch, branchfc), schema) as Branch
        })

        // clear
        rawBranches = null
      } catch (e) {
        throw e
      }
    }

    const getReposNumber = async () => {
      const code1 = 'total_private_repos'
      const code2 = 'public_repos'
      let path
      let headers = { Accept: 'application/vnd.github.v3+json' }
      if (token) {
        path = '/user'
        headers['Authorization'] = token
      } else {
        path = `/users/${username}`
      }
      try {
        const data = await this.get(path, null, { headers })
        const pri_n =
          parseInt(filterObject(data, code1)['total_private_repos']) || 0
        const pub_n = parseInt(filterObject(data, code2)['public_repos']) || 0
        return pri_n + pub_n
      } catch (e) {
        throw e
      }
    }

    try {
      // Because Get /users/vuejs/repos has big data, so make big stone into pieces
      const total = await getReposNumber()
      const per_page = 5
      const page_count = Math.ceil(total / per_page)
      const launchArr = genArrayForAsync(1, page_count)

      let result: Repo[] = []

      // const rawRepo = (
      //   await this.get(path, { per_page: 1, page: 1 }, { headers })
      // )[0]
      //
      // const repo = pick(filterObject(rawRepo, filtercode), schemaFigure) as Repo
      //
      // await injectBranchesInfo(repo)
      //
      // result.push(repo)

      await runAsyncArray(launchArr, async cursor => {
        let rawRepos

        try {
          // curl  -H "Accept: application/vnd.github.v3+json" \
          // https://api.github.com/users/vuejs/repos?per_page=5&page=2
          rawRepos = await this.get(
            path,
            { per_page, page: cursor },
            { headers }
          )
        } catch (e) {
          throw e
        }

        try {
          await runAsyncArray(rawRepos, async rawRepo => {
            let tmp = pick(
              filterObject(rawRepo, filtercode),
              schemaFigure
            ) as Repo
            await runAsyncAll(injectForkFrom(tmp), injectBranchesInfo(tmp))

            // if (!r1) throw new Error('Error injectForkFrom')
            // if (!r2) throw new Error('Error injectBranchesInfo')

            injectFlags(tmp, Flag.update)
            result.push(tmp)
          })
        } catch (e) {
          throw e
        }
      })

      attach.repos = result
      print('repos data is ok!', 3, 'Initialize')
    } catch (e) {
      throw e
    }
  }

  /**
   * Get Tree layer through uri
   * @param uri /repos/vuejs/vue/git/trees/{sha}
   * For Github rate limit and big amount of repo's files
   * */
  async getTreeLayer(uri: string) {
    uri = deUrlPrefix(uri, 'repo')
    const fc = 'path,type,url'
    const schema = {
      name: 'path',
      type: 'type',
      uri: () => ['url', (url: string) => deUrlPrefix(url, 'repo')],
    }

    try {
      // curl \
      // -H "Accept: application/vnd.github.v3+json" \
      // https://api.github.com/repos/vuejs/vue/git/trees/0948d999f2fddf9f90991956493f976273c5da1f
      const { tree } = await this.get(uri, null, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      })
      return (tree as any[]).map(rawNode => {
        let r = pick(filterObject(rawNode, fc), schema)
        injectFlags(r, Flag.update)
        return r
      }) as File[]
    } catch (e) {
      throw e
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Get Markdown Html
   * */
  async getMarkDownHtml(uri: string): Promise<string> {
    try {
      // curl  -H "Accept: application/vnd.github.v3.html" \
      // https://api.github.com/repos/vuejs/vue/readme
      return await this.get(uri, null, {
        headers: { Accept: 'application/vnd.github.v3.html' },
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Get README of a repo
   * @param fullname like: vuejs/vue
   * */
  async getReadMe(fullname: string): Promise<string> {
    try {
      // curl  -H "Accept: application/vnd.github.v3.html" \
      // https://api.github.com/repos/vuejs/vue/readme
      return await this.get(`/repos/${fullname}/readme`, null, {
        headers: { Accept: 'application/vnd.github.v3.html' },
      })
    } catch (error) {
      throw error
    }
  }

  async getFile(uri: string): Promise<string> {
    try {
      //  curl \
      //    -H "Accept: application/json" \
      //  https://api.github.com/repos/istomyang/vue/git/blobs/0d09d2d1c0222d3a02807b63ce6fa90f42cea655
      const raw = await this.get(uri, null, {
        headers: { Accept: 'application/vnd.github.v3.raw' },
      })
      return highlight(raw as string)
    } catch (e) {
      throw e
    }
  }
}
