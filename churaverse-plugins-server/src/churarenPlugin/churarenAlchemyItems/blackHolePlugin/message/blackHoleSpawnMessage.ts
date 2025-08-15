import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { Sendable, SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface BlackHoleSpawnData extends SendableObject {
  blackHoleId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class BlackHoleSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BlackHoleSpawnData) {
    super('blackHoleSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    blackHoleSpawn: BlackHoleSpawnMessage
  }
}
