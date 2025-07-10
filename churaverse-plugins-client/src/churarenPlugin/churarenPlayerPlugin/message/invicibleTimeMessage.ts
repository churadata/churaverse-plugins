import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { IMainScene } from 'churaverse-engine-client'

export interface InvicibleTimeData extends SendableObject {
  playerId: string
  invicibleTime: number
}

export class InvicibleTimeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: InvicibleTimeData) {
    super('invicibleTime', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    invicibleTime: InvicibleTimeMessage
  }
}
