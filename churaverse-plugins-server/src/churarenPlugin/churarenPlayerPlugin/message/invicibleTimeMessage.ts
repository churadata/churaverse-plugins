import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface InvicibleTimeData extends SendableObject {
  playerId: string
  invicibleTime: number
}

export class InvicibleTimeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: InvicibleTimeData) {
    super('invicibleTime', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    invicibleTime: InvicibleTimeMessage
  }
}
