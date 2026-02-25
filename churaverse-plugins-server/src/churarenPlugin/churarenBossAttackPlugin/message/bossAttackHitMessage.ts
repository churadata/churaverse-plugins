import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface BossAttackHitData extends SendableObject {
  bossAttackId: string
}

export class BossAttackHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossAttackHitData) {
    super('bossAttackHit', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    bossAttackHit: BossAttackHitMessage
  }
}
