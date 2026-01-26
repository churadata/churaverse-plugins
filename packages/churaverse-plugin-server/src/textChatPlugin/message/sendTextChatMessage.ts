import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface SendTextChatData extends SendableObject {
  playerId: string
  message: string
}

export class SendTextChatMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SendTextChatData) {
    super('sendTextChatMessage', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    sendTextChatMessage: SendTextChatMessage
  }
}
