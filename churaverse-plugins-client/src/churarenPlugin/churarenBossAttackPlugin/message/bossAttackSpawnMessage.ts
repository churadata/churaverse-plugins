import { IMainScene, Vector, Direction } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { Sendable, SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface BossAttackSpawnData extends SendableObject {
  bossAttackId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class BossAttackSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossAttackSpawnData) {
    super('bossAttackSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    bossAttackSpawn: BossAttackSpawnMessage
  }
}
