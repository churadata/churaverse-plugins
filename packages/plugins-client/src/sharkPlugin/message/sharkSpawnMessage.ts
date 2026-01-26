import { IMainScene, Vector, Direction } from 'churaverse-engine-client'
import { Sendable, SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'

export interface SharkSpawnData extends SendableObject {
  sharkId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class SharkSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SharkSpawnData) {
    super('sharkSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    sharkSpawn: SharkSpawnMessage
  }
}
