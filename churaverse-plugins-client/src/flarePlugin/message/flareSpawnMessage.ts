import { IMainScene, Vector, Direction } from 'churaverse-engine-client'
import { Sendable, SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'

export interface FlareSpawnData extends SendableObject {
  flareId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class FlareSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlareSpawnData) {
    super('flareSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    flareSpawn: FlareSpawnMessage
  }
}
