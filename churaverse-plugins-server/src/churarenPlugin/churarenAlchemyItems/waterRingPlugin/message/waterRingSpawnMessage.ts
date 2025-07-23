import { Vector, Direction, IMainScene } from 'churaverse-engine-server'
import { Sendable, SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

export interface WaterRingSpawnData extends SendableObject {
  waterRingId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class WaterRingSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: WaterRingSpawnData) {
    super('waterRingSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    waterRingSpawn: WaterRingSpawnMessage
  }
}
