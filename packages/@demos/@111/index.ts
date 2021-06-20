import { log } from 'console'
import { delay } from '@lv/shared/common'
import { Low, JSONFile } from '@lv/lowdb'
import { join } from 'path'
import { CollectionChain, chain, List } from 'lodash'
import { writeFile } from 'fs'

interface CacheInfo {
  // ['/repos/user/{sha}']
  uri: string
  // db does not have
  time?: Date
  // 'JSON'
  content?: string
}

async function bootstrap() {
  let db: Low
  let collection: CollectionChain<CacheInfo>
  const file = join(__dirname, 'local.json')
  const adapter = new JSONFile<List<CacheInfo>>(file)
  db = new Low<List<CacheInfo>>(adapter)
  try {
    await db.read()
    // console.log('local.json read:', db.data)
  } catch (error) {
    db.data = [] as List<CacheInfo>
  }
  collection = chain<CacheInfo>(db.data as List<CacheInfo>)

  console.log(collection.find({ uri: '1111' }).value())

  // collection
  //   .push({
  //     uri: '1111',
  //     content: 'wwwwwwwwwwwwwwwwww',
  //   } as CacheInfo)
  //   .push({
  //     uri: '2222',
  //     content: 'wwwwwwwwwwwwwwwwww',
  //   } as CacheInfo)
  //   .push({
  //     uri: '3333',
  //     content: 'wwwwwwwwwwwwwwwwww',
  //   } as CacheInfo)
  //   .value()

  await db.write()
}

bootstrap().catch()
