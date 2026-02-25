import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { IMainScene } from 'churaverse-engine-client'

export interface ExplosionHitData extends SendableObject {
  explosionId: string
}

export class ExplosionHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ExplosionHitData) {
    super('explosionHit', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    explosionHit: ExplosionHitMessage
  }
}
