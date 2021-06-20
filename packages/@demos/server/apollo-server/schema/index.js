const { gql } = require('apollo-server')
const { JSONResolver, JSONObjectResolver } = require('graphql-scalars')
const moment = require('moment')
require('moment/locale/zh-cn.js')

class Timer {
  #timestamp
  #timeInterval
  #pubSub

  static CHANNEL = {
    timer: 'timer',
  }

  constructor(pubSub) {
    this.#timestamp = Date.now()
    this.#pubSub = pubSub
    moment.locale('zh-cn')
  }

  get time() {
    return moment(this.#timestamp).unix()
  }
  set time(timestamp) {
    this.#timestamp = timestamp
  }

  reset() {
    this.#timestamp = Date.now()
  }

  heartbeat() {
    this.#timeInterval = setInterval(
      this.publish,
      1000,
      this.#pubSub,
      this.time
    )
  }

  heartOnce() {
    this.#publish(this.#pubSub, this.time)
  }

  stop() {
    clearInterval(this.#timeInterval)
  }

  #publish(pubSub, time) {
    pubSub.publish(Timer.CHANNEL.timer, { timer: time }).then()
  }
}

exports.typeDefs = [
  gql`
    scalar JSON
    scalar JSONObject
  `,

  gql`
    type Query {
      getJsonData: JSONObject
      message: String
    }

    type Mutation {
      heartOnce(type: String): JSON
    }

    type Subscription {
      timer: String
    }
  `,
]

exports.resolvers = [
  {
    Query: {
      getJsonData(_, __) {
        return {
          d1: 1,
          d2: 2,
          d3: 3,
        }
      },
      message() {
        return 'Hey, Apollo!'
      },
    },
    Mutation: {
      heartOnce(_, __, { pubSub }) {
        const timer = new Timer(pubSub)
        timer.heartOnce()
        return ''
      },
    },
    Subscription: {
      timer: {
        subscribe: (_, __, { pubSub }) =>
          pubSub.asyncIterator([Timer.CHANNEL.timer]),
      },
    },
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
  },
]
