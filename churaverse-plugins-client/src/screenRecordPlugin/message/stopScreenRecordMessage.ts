import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface StopScreenRecordData extends SendableObject {
  playerId: string
}

export class StopScreenRecordMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: StopScreenRecordData) {
    super('stopScreenRecordMessage', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    stopScreenRecordMessage: StopScreenRecordMessage
  }
}
