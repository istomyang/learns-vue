import { PubSub } from 'apollo-server-koa'

export interface PubSubObject {
  channel: string
  payload_0: object
  payload_1: object
  ms?: number
  timeInterval?: NodeJS.Timeout
}

export enum Channel {
  TOKEN = 'token',
  INIT = 'initUser',
}

const pubSubInit = {
  channel: Channel.INIT,
  payload_0: { waitInit: false },
  payload_1: { waitInit: true },
  ms: 1000,
} as PubSubObject

const pubSubToken = {
  channel: Channel.TOKEN,
  payload_0: { waitToken: false },
  payload_1: { waitToken: true },
  ms: 1000,
} as PubSubObject

export enum SubList {
  token,
  init,
}

// noinspection SpellCheckingInspection
/**
 * PubSub Manager
 * */
export class PSM {
  public readonly pubSub: PubSub = new PubSub()
  private list: PubSubObject[] = []

  constructor(...psos: PubSubObject[]) {
    this.addPso(...psos)
  }

  /**
   * @return duplicate  if has, then return
   * */
  addPso(...psos: PubSubObject[]): string[] {
    const result = []
    psos.forEach(pso => {
      if (!pso.ms) pso.ms = 3000
      const has = this.list.some(i => i.channel === pso.channel)
      if (!has) {
        this.list.push(pso)
      } else {
        result.push(pso.channel)
      }
    })
    return result
  }

  heartbeat(...channels: string[]) {
    channels.forEach(channel => {
      const query = this.queryChannel(channel)
      query.timeInterval = setInterval(
        PSM.publish,
        query.ms,
        this.pubSub,
        query.channel,
        query.payload_0
      )
    })
  }

  private stop(...channels: string[]) {
    channels.forEach(channel => {
      const query = this.queryChannel(channel)
      clearInterval(query.timeInterval)
    })
  }

  emit(...channels: string[]) {
    this.stop(...channels)
    channels.forEach(channel => {
      const query = this.queryChannel(channel)
      PSM.publish(this.pubSub, query.channel, query.payload_1)
    })
  }

  private queryChannel(channel: string) {
    return this.list.find(pso => pso.channel === channel)
  }

  private static publish(pubSub: PubSub, channel, payload: any) {
    pubSub.publish(channel, payload).then()
  }
}

export const PSMInstance = new PSM(pubSubInit, pubSubToken)
