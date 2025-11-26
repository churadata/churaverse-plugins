import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { Sendable, SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface ExplosionSpawnData extends SendableObject {
  explosionId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class ExplosionSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ExplosionSpawnData) {
    super('explosionSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    explosionSpawn: ExplosionSpawnMessage
  }
}
