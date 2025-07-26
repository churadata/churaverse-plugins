import { IMainScene, Direction, Vector } from 'churaverse-engine-client'
import { Sendable, SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'

export interface TrapSpawnData extends SendableObject {
  trapId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class TrapSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TrapSpawnData) {
    super('trapSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    trapSpawn: TrapSpawnMessage
  }
}
