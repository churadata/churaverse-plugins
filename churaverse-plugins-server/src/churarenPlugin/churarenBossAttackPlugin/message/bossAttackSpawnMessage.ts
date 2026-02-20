import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface BossAttackSpawnData extends SendableObject {
  bossAttackId: string
  startPos: Vector & SendableObject
  direction: Direction
  spawnTime: number
}

export class BossAttackSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossAttackSpawnData) {
    super('bossAttackSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    bossAttackSpawn: BossAttackSpawnMessage
  }
}
