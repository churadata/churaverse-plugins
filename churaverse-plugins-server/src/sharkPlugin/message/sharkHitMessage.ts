import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface SharkHitData extends SendableObject {
  sharkId: string
}

export class SharkHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SharkHitData) {
    super('sharkHit', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    sharkHit: SharkHitMessage
  }
}
