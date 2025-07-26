import { IMainScene, Vector, Direction } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { Sendable, SendableObject } from '@churaverse/network-plugin-server/types/sendable'

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

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    trapSpawn: TrapSpawnMessage
  }
}
