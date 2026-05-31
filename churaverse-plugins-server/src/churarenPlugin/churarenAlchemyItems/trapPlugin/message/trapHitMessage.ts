import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface TrapHitData extends SendableObject {
  trapId: string
}

export class TrapHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TrapHitData) {
    super('trapHit', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    trapHit: TrapHitMessage
  }
}
