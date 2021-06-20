import { MongoClient, Db } from 'mongodb'
import { print } from '@lv/shared/node'

const uri = 'mongodb://127.0.0.1:27017'

/**
 * TODO：对象验证：https://joi.dev/
 * DONE: TS can check type
 *
 * > Mongoose https://mongoosejs.com/docs/guide.html
 * > MongoDB Driver http://mongodb.github.io/node-mongodb-native/3.6/api/index.html
 * > mquery https://github.com/aheckmann/mquery/
 */
export default async () => {
  let status: boolean
  let db: Db
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()
    status = true
    db = client.db('lv')
  } catch (error) {
    status = false
    await client.close()
  }

  if (status) {
    print('MongoDb is run!', 3, 'Initialize')
  } else {
    print('MongoDb does not work!', 1, 'Initialize')
  }

  return [db, status]
}

export const hasCollection = async (
  db: Db,
  collectionName: string
): Promise<boolean> => {
  return (await db.collections()).some(
    collection => collection.collectionName === collectionName
  )
}
