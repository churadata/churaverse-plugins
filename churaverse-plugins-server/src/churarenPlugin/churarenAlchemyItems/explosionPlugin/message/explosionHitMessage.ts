import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface ExplosionHitData extends SendableObject {
  explosionId: string
}

export class ExplosionHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ExplosionHitData) {
    super('explosionHit', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    explosionHit: ExplosionHitMessage
  }
}
