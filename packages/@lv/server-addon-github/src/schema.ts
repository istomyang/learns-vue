// noinspection JSUnusedGlobalSymbols

import { gql } from 'apollo-server-koa'
import globby from 'globby'
import { PSM, PubSubObject } from './'
import moment from 'moment'
import 'moment/locale/zh-cn.js'

// scalars
import {
  DateTimeResolver,
  JSONResolver,
  JSONObjectResolver,
} from 'graphql-scalars'

class Timer {
  private _timestamp
  public static Channel = 'Timer'

  constructor() {
    this._timestamp = Date.now()

    moment.locale('zh-cn')
  }
  get time(): string {
    return moment(this._timestamp).toNow()
  }
  set time(timestamp: string) {
    this._timestamp = timestamp
  }

  reset() {
    this._timestamp = Date.now()
  }
}

const typeDefs = [
  gql`
    enum ControlStatus {
      start
      reset
      pause
    }
  `,
  gql`
    # 支持 YYYY-MM-DDThh:mm:ss.*sZ
    scalar DateTime
    # In src code, Object, number, and string can handle directly by JSON
    scalar JSON
    scalar JSONObject
  `,
  gql`
    type Query {
      message: String!
      testDataTime: DateTime
      testJson: JSON
      testJsonObject: JSONObject
    }

    type Mutation {
      test(msg: String): JSONObject
      controlTimer(status: ControlStatus): JSONObject
    }

    type Subscription {
      timer: String
    }
  `,
]

const resolvers = [
  {
    Query: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      message: (_, __) => 'Hey! Graphql.',
      testDataTime: () => new Date(),
      testJson: () => 'test json scalar!',
      testJsonObject: () => {
        return {
          json: 'Json Object',
        }
      },
    },

    // scalars
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,

    Mutation: {
      test: (_, { msg }) => {
        return {
          status: 'ok',
          data: `Echo: ${msg}`,
        }
      },
      controlTimer: (_, { status }, { Psm }) => {
        const timer = new Timer()
        const psm: PSM = Psm

        psm.addPso({
          channel: Timer.Channel,
          payload_0: { timer: timer.time },
          payload_1: { timer: timer.time },
          ms: 1000,
        } as PubSubObject)

        try {
          switch (status) {
            case 'start':
              psm.heartbeat(Timer.Channel)
              break
            case 'reset':
              timer.reset()
              psm.heartbeat(Timer.Channel)
              break
            case 'pause':
            default:
              psm.emit(Timer.Channel)
              break
          }
          return { status: 'ok' }
        } catch (e) {
          return {
            status: 'fail',
            message: e.message,
          }
        }
      },
    },
    Subscription: {
      timer: {
        subscribe: (_, __, { Psm }) =>
          (Psm as PSM).pubSub.asyncIterator([Timer.Channel]),
      },
    },
  },
]

const findFiles = async (patterns: string | string[]) =>
  await globby(patterns, {
    cwd: __dirname,
    absolute: true,
    onlyFiles: true,
  })

export const exportSchema = async () => {
  try {
    const files = await findFiles('./schema/**/*.ts')
    for (const path of files) {
      const { typeDef, resolver } = await import(path)
      typeDef && typeDefs.push(typeDef)
      resolver && resolvers.push(resolver)
    }
  } catch (error) {
    console.error(error)
  }

  return [typeDefs, resolvers]
}
