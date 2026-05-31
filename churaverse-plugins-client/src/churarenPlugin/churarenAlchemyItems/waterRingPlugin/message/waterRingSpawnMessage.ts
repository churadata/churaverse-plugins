import { IMainScene, Direction, Vector } from 'churaverse-engine-client'
import { SendableObject, Sendable } from '@churaverse/network-plugin-client/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'

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

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    waterRingSpawn: WaterRingSpawnMessage
  }
}
