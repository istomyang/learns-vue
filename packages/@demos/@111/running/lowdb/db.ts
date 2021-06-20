import { Low, JSONFile } from 'lowdb'
import { join } from 'path'
import _, { chain, ObjectChain } from 'lodash'
import { log, error } from 'console'
import { writeFile } from 'fs'

type Data = {
  [name: string]: User
}

type User = {
  name: string
  age: number
}

const init = (collection: ObjectChain<Data>) => {
  const datas = [
    { name: 'a', age: 10 } as User,
    { name: 'b', age: 20 } as User,
    { name: 'c', age: 20 } as User,
    { name: 'd', age: 20 } as User,
  ]

  for (let i = 0; i < datas.length; i++) {
    collection = collection.set(datas[i].name, datas[i])
  }

  collection.value()
  log(collection.value())
}

const findAll = (collection: ObjectChain<Data>) => {
  return collection.filter({ age: 20 }).value()
}

const find = (collection: ObjectChain<Data>) => {
  return collection.find({ age: 20 }).value()
}

const update = (collection: ObjectChain<Data>) => {
  collection.update('a.name', n => 'zzzz').value()
}

const del = (collection: ObjectChain<Data>) => {
  collection.unset('a').value()
}

const has = (collection: ObjectChain<Data>) => {
  collection.has('b').value()
}

const pick = (collection: ObjectChain<Data>) => {
  return collection.pick(['e.gs.a']).value()
}

async function boot() {
  const file = join(__dirname, 'db.json')
  const adapter = new JSONFile<Data>(file)
  const db = new Low<Data>(adapter)

  try {
    await db.read()
  } catch (error) {
    db.data = {}
  }
  const collection = chain((db.data ||= {}))

  init(collection)

  // log(collection.value())

  // log(find(collection))

  // update(collection)

  // del(collection)

  // log(pick(collection))

  log(collection.value())

  try {
    await db.write()
  } catch (err) {
    await writeFile(
      './db.json',
      JSON.stringify(db.data),
      { encoding: 'utf-8' },
      () => {}
    )
  } finally {
    db.data = null
  }
}

boot().catch(log)
