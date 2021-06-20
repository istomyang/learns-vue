import { Neter } from './net'
import initMongo from './mBase'
import { MUser } from './mUser'
import { MCache } from './mCache'
import { Localer } from './localer'
import { runAsyncAll, isEmpty } from '@lv/shared/common'
import { isOnline, print } from '@lv/shared/node'
import { User } from '../types/user'
import { Db } from 'mongodb'

type Status = string

// 兼容：始终返回单例
const initDataApiSingleton = (() => {
  let flag = false
  let status: string

  let localer: Localer
  let neter: Neter
  let db: Db

  return async (): Promise<[Localer, Db, Neter, Status]> => {
    let mStatus: boolean
    try {
      if (!flag) {
        ;[localer, [db, mStatus], neter] = await runAsyncAll(
          Localer.init(),
          initMongo(),
          () => new Neter()
        )

        flag = true
      }

      // status check
      const a = await isOnline()
      if (a) print('Net is work!',3,'Initialize')

      // Now I consider two conditions: have db or not
      if (!a) process.exit(-1)
      if (a && mStatus) status = 'full'
      if (!mStatus) status = 'nodb'

      process.env.lv_data_mode = status

      return [localer, db, neter, status]
    } catch (error) {
      throw error
    }
  }
})()

export class DataApi {
  public mUser: MUser
  public mCache: MCache
  public localer: Localer
  public neter: Neter
  public mode: string

  static async init(): Promise<DataApi> {
    try {
      const da = new DataApi()
      let db: Db
      ;[da.localer, db, da.neter, da.mode] = await initDataApiSingleton()

      da.mUser = new MUser(db)
      da.mCache = await MCache.init(db)

      const mHasData = await da.mUser.checkHasData()

      if (!mHasData && da.localer.hasData) {
        await da.fileToDb()
      }

      print('Done: DataApi', 3, 'Initialize')
      return da
    } catch (err) {
      throw err
    }
  }

  /**
   * Init user's data includes Profile and Repo(basic)
   * 1. get data from net
   * 2. save to local and db
   * */
  async initUserData(username: string) {
    try {
      if (this.mode === 'full') {
        // Note: attaching may cause big memory occupied.
        const UserAttach = (await this.mUser.collection.findOne({
          username,
        })) as User

        // attach operation
        await runAsyncAll(
          this.neter.injectUserProfile(UserAttach),
          this.neter.injectUserRepos(UserAttach)
        )

        print('init data is OK', 3, 'initUserData')

        // save
        await runAsyncAll(
          this.mUser.collection.updateOne(
            { username },
            {
              $set: { profile: UserAttach.profile, repos: UserAttach.repos },
            }
          ),
          (async () => {
            this.localer.collection
              .set(`${username}.profile`, UserAttach.profile)
              .set(`${username}.repos`, UserAttach.repos)
              .value()
            await this.localer.saveToFile()
          })()
        )
      }
    } catch (e) {
      throw e
    }
  }

  /**
   * Init user's data includes Profile and Repo(basic)
   * 1. get data from net
   * 2. save to local and db
   * */
  async initUserDataTest(username: string) {
    try {
      const UserAttach = this.localer.collection
        .find({
          username,
        })
        .value() as User

      isEmpty(UserAttach.repos) || delete UserAttach.repos

      // attach operation
      await runAsyncAll(
        // this.neter.injectUserProfile(UserAttach),
        this.neter.injectUserRepos(UserAttach)
      )

      print('init data is OK', 3, '[initUserData]')

      // save
      await runAsyncAll(
        (async () => {
          this.localer.collection
            // .set(`${username}.profile`, UserAttach.profile)
            .set(`${username}.repos`, UserAttach.repos)
            .value()
          await this.localer.saveToFile()
        })()
      )
    } catch (e) {
      throw e
    }
  }

  private static deId(rawObject: object): any[] {
    return Object.values(rawObject).map(o => {
      o['_id'] && delete o['_id']
      return o
    })
  }

  async fileToDb() {
    const raw = this.localer.collection.value()
    try {
      await this.mUser.collection.insertMany(DataApi.deId(raw))
    } catch (e) {
      throw e
    }
  }

  // async correctData(username: string) {
  //   try {
  //     if (this.mode === 'full') {
  //       // db
  //       const correctDb = async () => {
  //         await this.mUser.collection.updateOne(
  //           { username },
  //           // @ts-ignore
  //           { $set: { profile: {}, repos: [] } }
  //         )
  //       }
  //       const correctLocal = async () => {
  //         this.localer.collection
  //           .find({ username })
  //           .unset('profile')
  //           .unset('repos')
  //           .value()
  //         await this.localer.saveToFile()
  //       }
  //     }
  //   } catch (e) {
  //     throw e
  //   }
  // }
}

export { Localer } from './localer'
export { Neter } from './net'
export { MUser } from './mUser'
export { MCache } from './mCache'
