import { join } from 'path'
import { Low, JSONFile } from '@lv/lowdb'
import { ObjectChain, chain } from 'lodash'
import { writeFile } from 'fs'

import { UserStatus, Users, User, LoginUserBasicInfo } from '../types/user'

/**
 * Why named Localer?
 * When I rename with 'local', also with file name, it really made my 'localer 疼'
 * */
export class Localer {
  // {username: {...data}}
  public collection: ObjectChain<Users>
  public db: Low
  // Need when offline
  public hasData: boolean

  static async init() {
    const localer = new Localer()

    const file = join(__dirname, 'local.json')
    const adapter = new JSONFile<Users>(file)
    localer.db = new Low<Users>(adapter)

    try {
      await localer.db.read()
      console.log('local.json read:', localer.db.data)
    } catch (error) {
      localer.db.data = {} as Users
    }

    localer.collection = chain<Users>(
      localer.db.data as Users
    ) as ObjectChain<Users>

    localer.hasData = Object.keys(localer.collection.value()).length !== 0

    return localer
  }

  /**
   * Save data to local file
   * */
  public async saveToFile() {
    try {
      await this.db.write()
    } catch (error) {
      await writeFile(
        join(__dirname, 'local.json'),
        JSON.stringify(this.db.data),
        { encoding: 'utf-8' },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      )
    }
  }

  async setNewLoginUser(data: User) {
    const username = data.username
    const has = this.hasUserInfo(data)

    if (has) {
      this.collection.update(username, n => data).value()
    } else {
      this.collection.set(username, data).value()
    }

    await this.saveToFile()
  }

  async setOauthUserToken(token: string) {
    const username = this.collection.find({ status: UserStatus.oauth }).value()
      .username
    this.collection
      .update(`${username}.oauth.token`, n => token)
      .update(`${username}.status`, n => UserStatus.login)
      .value()
    await this.saveToFile()
  }

  getUserInOauth() {
    return this.collection.find({ status: UserStatus.oauth }).value()
  }

  /**
   * Check has Userinfo
   * 1. if data has oauth, db hasn't, then retuen false.
   * 2. if data has no oauth, db has no oauth, then return true.
   * 3. if nothing to find, return false
   */
  hasUserInfo(data: User): boolean {
    const d = this.collection.has(data.username).value()
    if (!d) {
      return false
    }

    const r1 = !!data.oauth.client_id
    const r2 = this.collection.has(`${data.username}.oauth.client_id`).value()

    if (r1 && !r2) return false
    if (!r1 && !r2) return true
  }

  async delUserInfo(username: string) {
    this.collection.unset(username).value()
    await this.saveToFile()
  }

  /**
   * RUNNING
   * @returns
   */
  getLoginUserInfo(): LoginUserBasicInfo[] {
    const mapping: (user: User) => LoginUserBasicInfo = user => ({
      name: user.profile.name,
      login: user.profile.login,
      avatar_url: user.profile.avatar_url,
      bio: user.profile.bio,
      location: user.profile.location,
      email: user.profile.email,
      html_url: user.profile.html_url,
    })

    return this.collection
      .filter({ status: UserStatus.login })
      .map(mapping)
      .value()
  }
}

// class _Local extends AsyncConstructor {
//   private db: LowdbNS.LowdbAsync<User>
//   private user_ctx: string

//   /**
//    * Local Storage
//    * @param json e.g. local.json or ../local.json
//    */
//   constructor(json: string) {
//     const Lowdb = ld as LowdbNS.lowdb
//     const FileAsync = fasync as LowdbNS.AdapterAsync
//     const adapter = new FileAsync<User>(resolve(__dirname), json)

//     super(async () => {
//       try {
//         this.db = await Lowdb(adapter)
//       } catch (error) {}
//     })
//   }

//   // 能不能本地模式
//   canLocalData(): boolean {
//     return this.has('', true)
//   }

//   ///////////////////////////////////////////////////////////
//   ///////////////////////// Oauth ///////////////////////////
//   ///////////////////////////////////////////////////////////

//   async setUserOAuthInfo(data: User) {}

//   ///////////////////////////////////////////////////////////
//   ///////////////////////// Db api //////////////////////////
//   ///////////////////////////////////////////////////////////

//   /**
//    * 设置值
//    * @param path e.g. a.v.c.d
//    * @param val
//    * @param de whether remove username prefix
//    */
//   private set(path: string, val: any, de = false): void {
//     if (de) {
//       path = path.replace(/^\./, '')
//     } else {
//       path = `${this.user_ctx}.${path.replace(/^\./, '')}`
//     }
//     this.db
//       .set(path, val)
//       .write()
//       .then(() => {})
//   }

//   /**
//    * 获取值
//    * @param path e.g. a.v.c.d
//    * @param de whether remove username prefix
//    */
//   private get(path: string, de = false): any {
//     if (de) {
//       path = path.replace(/^\./, '')
//     } else {
//       path = `${this.user_ctx}.${path.replace(/^\./, '')}`
//     }
//     return this.db.get(path).value()
//   }

//   /**
//    * 在不在
//    * @param path e.g. a.v.c.d
//    * @param de whether remove username prefix
//    */
//   private has(path: string, de = false): boolean {
//     if (de) {
//       path = path.replace(/^\./, '')
//     } else {
//       path = `${this.user_ctx}.${path.replace(/^\./, '')}`
//     }
//     return this.db.has(path).value()
//   }

//   /**
//    * 更新
//    * @param path e.g. a.v.c.d
//    * @param de whether remove username prefix
//    */
//   private update(path: string, val: any, de = false): void {
//     if (de) {
//       path = path.replace(/^\./, '')
//     } else {
//       path = `${this.user_ctx}.${path.replace(/^\./, '')}`
//     }
//     this.db
//       .update(path, v => val)
//       .write()
//       .then(() => {})
//   }

//   /**
//    * Find and return data
//    * @param root e.g. a.b.c
//    * @param ref e.g. {a:1}
//    * @returns
//    */
//   private find(root: string, ref: object): Result {
//     const result = this.db.get(root).find(ref).value()
//     return {
//       status: Status.success,
//       data: result,
//     } as Result
//   }

//   ///////////////////////////////////////////////////////////
//   ///////////////////////// Oauth ///////////////////////////
//   ///////////////////////////////////////////////////////////

//   /**
//    * 创建或者更新验证用户的信息，包含检测
//    */
//   setUserOAuthInfo2({
//     username,
//     client_id,
//     client_secret,
//     token,
//   }: {
//     username: string
//     client_id: string
//     client_secret: string
//     token?: string
//   }): Result {
//     this.user_ctx = username

//     this.update('status', UserStatus.show)

//     // If has token, donnot check
//     if (token) {
//       this.update('oauth.token', token)
//       return {
//         status: Status.success,
//       } as Result
//     }

//     // 存在就更新，并且进行验证
//     if (this.has(username, true) && this.has('oauth')) {
//       const _client_id = this.get('oauth.client_id')
//       const _client_secret = this.get('oauth.client_secret')

//       // Same return
//       if (client_id === _client_id && client_secret === _client_secret) {
//         return {
//           status: Status.has,
//         } as Result
//       }

//       this.set('oauth.client_id', client_id)
//       this.set('oauth.client_secret', client_secret)

//       return {
//         status: Status.success,
//       } as Result
//     }

//     // 访客用户按新用户处理
//     this.set('oauth.client_id', client_id)
//     this.set('oauth.client_secret', client_secret)
//     return {
//       status: Status.success,
//     } as Result
//   }

//   /**
//    * 获取当前验证用户信息
//    * @param username
//    */
//   getUserOAuthInfo(username: string): Result {
//     this.user_ctx = username

//     if (this.has(username, true) && this.has('oauth')) {
//       return {
//         status: Status.success,
//         data: {
//           client_id: this.get('oauth.client_id'),
//           client_secret: this.get('oauth.client_secret'),
//           token: this.has('oauth.token') && this.get('oauth.token'),
//         } as OAuth,
//       } as Result
//     }

//     return {
//       status: Status.faild,
//     } as Result
//   }

//   getWhoOauth(): Result {
//     return {
//       status: Status.success,
//       data: this.db.findKey(o => o.status === UserStatus.oauth),
//     } as Result
//   }

//   ///////////////////////////////////////////////////////////
//   ///////////////////////// Others //////////////////////////
//   ///////////////////////////////////////////////////////////
//   hasLocalData(username: string) {
//     return this.has(username, true).value()
//   }

//   getShowUser() {
//     return this.db
//       .get('')
//       .find(o => o.status === UserStatus.show)
//       .value()
//   }
// }
