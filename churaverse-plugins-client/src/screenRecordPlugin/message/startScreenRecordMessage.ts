import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface StartScreenRecordData extends SendableObject {
  playerId: string
}

export class StartScreenRecordMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: StartScreenRecordData) {
    super('startScreenRecordMessage', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    startScreenRecordMessage: StartScreenRecordMessage
  }
}
