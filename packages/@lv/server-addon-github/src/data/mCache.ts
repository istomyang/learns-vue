import { Collection, Db } from 'mongodb'
import { Timer, runAsyncAll } from '@lv/shared/common'
import { join } from 'path'
import { Low, JSONFile } from '@lv/lowdb'
import { CollectionChain, chain, List } from 'lodash'
import { writeFile } from 'fs'
import { hasCollection } from './mBase'
import { Date } from 'graphql-scalars/mocks'

// LRU cache strategy
interface CacheInfo {
  // ['/repos/user/{sha}']
  uri: string
  // db does not have
  time?: Date | string
  // 'JSON'
  content?: string
}

const ExpiredTime = 7

/**
 * Use LRU cache strategy:
 * */
export class MCache {
  public dbCollection: Collection<CacheInfo>
  public localCollection: CollectionChain<CacheInfo>
  public lowdb: Low
  public mongodb: Db
  private readonly max: number

  private cacheList: CacheInfo[] = []

  constructor(db: Db, max: number = 1000) {
    this.dbCollection = db.collection<CacheInfo>('github-cache')
    this.max = max
    this.mongodb = db
  }

  static async init(db: Db, max: number = 1000) {
    // TODO: 目前不采用从本地文件或现成的数据库载入内存进行管理，直接清库。
    // DONE：Loading data from local file
    try {
      await db.dropCollection('github-cache')
      await db.createCollection('github-cache')
    } catch (e) {
      /*let go*/
    }
    const cache = new MCache(db, max)

    cache.lowdb = new Low<List<CacheInfo>>(
      new JSONFile<List<CacheInfo>>(join(__dirname, 'cache.json'))
    )

    try {
      await cache.lowdb.read()
      // console.log('local.json read:', db.data)
    } catch (error) {
      console.error('mCache:: can not read from file')
      cache.lowdb.data = [] as List<CacheInfo>
    }

    cache.localCollection = chain<CacheInfo>(
      cache.lowdb.data as List<CacheInfo>
    )

    await cache.loading()

    return cache
  }

  async setCache(uri: string, content: string) {
    const time = Timer.getUpdate()
    try {
      this.localCollection
        .push({
          uri,
          content,
          time,
        })
        .value()
      await runAsyncAll(
        this.dbCollection.insertOne({
          uri,
          content,
          time,
        }),
        this.saveToFile()
      )

      this.cacheList.push({ uri, time })
      await this.runCleanIf()
    } catch (e) {
      throw e
    }
  }

  /**
   * Get Cache
   * Has expired validation: default is 7 days
   * */
  async getCache(uri: string) {
    const query = this.cacheList.find(item => item.uri === uri)
    if (!query) return null
    if (Timer.isExpired(query.time as Date, ExpiredTime)) return null
    query.time = Timer.getUpdate()
    const result = await this.dbCollection.findOne({ uri })
    return result.content
  }

  private async runCleanIf() {
    const many = this.cacheList.length - this.max
    if (many < 1) return
    const l = []
    this.cacheList.forEach(item => {
      l.push(item.time)
    })
    Timer.sort(l)
    const time = l[many]

    const delList = []
    const preserve = []

    this.cacheList.forEach(item => {
      if (Timer.athanb(item.time as Date, time) === -1) {
        delList.push(item.uri)
      } else {
        preserve.push(item)
      }
    })

    // 直接操作splice可能效率低，而且对原对象数组需要排序。
    // 直接数字排序+过滤替换，复杂度为线性。
    this.cacheList = preserve

    this.localCollection.pullAllBy(delList, 'uri')

    try {
      // db
      await runAsyncAll(
        this.dbCollection.deleteMany({ uri: { $in: delList } }),
        this.saveToFile()
      )
    } catch (e) {
      throw e
    }
  }

  private async saveToFile() {
    try {
      await this.lowdb.write()
    } catch (error) {
      console.error('mCache can not write lowdb')
      await writeFile(
        join(__dirname, 'cache.json'),
        JSON.stringify(this.lowdb.data),
        { encoding: 'utf-8' },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      )
    }
  }

  public async loading() {
    const raw = this.localCollection.value()
    if (!raw) return
    const mUse = []
    const dbUse = []
    raw.forEach(item => {
      const r = Timer.isExpiredString(item.time as string, ExpiredTime)
      if (!r) {
        mUse.push({ uri: item.uri, time: item.time } as CacheInfo)
        dbUse.push({
          uri: item.uri,
          time: item.time,
          content: item.content,
        } as CacheInfo)
      }
    })
    try {
      this.cacheList = mUse
      await this.dbCollection.insertMany(dbUse)
    } catch (e) {
      throw e
    }
  }

  /**
   * TODO
   * Launch, loading data into Memory list
   * @param type use mongodb data or local.json, 'db' or 'file'
   * */
  public async checkList(type: string = 'db') {}
}
