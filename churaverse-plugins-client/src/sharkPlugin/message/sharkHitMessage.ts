import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface SharkHitData extends SendableObject {
  sharkId: string
}

export class SharkHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SharkHitData) {
    super('sharkHit', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    sharkHit: SharkHitMessage
  }
}
