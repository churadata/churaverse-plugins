import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface SendTextChatData extends SendableObject {
  playerId: string
  message: string
}

export class SendTextChatMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SendTextChatData) {
    super('sendTextChatMessage', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    sendTextChatMessage: SendTextChatMessage
  }
}
