import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene, Direction, Vector } from 'churaverse-engine-server'

export interface BossAttackPositionData extends SendableObject {
  bossAttackId: string
  position: Vector & SendableObject
  direction: Direction
}

export class BossAttackPositionMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossAttackPositionData) {
    super('bossAttackPosition', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    bossAttackPosition: BossAttackPositionMessage
  }
}
