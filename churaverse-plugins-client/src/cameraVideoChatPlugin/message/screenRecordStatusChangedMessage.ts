import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { IMainScene } from 'churaverse-engine-client'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface ScreenRecordStatusChangedData extends SendableObject {
  isRecording: boolean
}

export class ScreenRecordStatusChangedMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ScreenRecordStatusChangedData) {
    super('screenRecordStatusChanged', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    screenRecordStatusChanged: ScreenRecordStatusChangedMessage
  }
}
