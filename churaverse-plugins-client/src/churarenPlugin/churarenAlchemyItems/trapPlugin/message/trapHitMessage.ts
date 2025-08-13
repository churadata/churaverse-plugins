import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface TrapHitData extends SendableObject {
  trapId: string
}

export class TrapHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TrapHitData) {
    super('trapHit', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    trapHit: TrapHitMessage
  }
}
