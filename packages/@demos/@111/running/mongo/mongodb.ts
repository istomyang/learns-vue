import { log } from 'console'
import { MongoClient, Db } from 'mongodb'

const uri = 'mongodb://127.0.0.1:27017'

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function run() {
  try {
    await client.connect()
    const db = client.db('lv')
    console.log((await db.collection())[0].collectionName)

    // const database = client.db('demo')
    // const users = database.collection('users')

    // const data = await users.insertOne({
    //   item: 'canvas',
    //   qty: 100,
    //   tags: ['cotton'],
    //   size: { h: 28, w: 35.5, uom: 'cm' },
    // })

    // const cursor = await users.findOne({ qty: 20 })
    // log(cursor)
  } catch (error) {
    await client.close()
  }
}

setTimeout(() => {
  log('Close!')
  process.exit(0)
}, 5000)

run().catch(log)
