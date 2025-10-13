import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { IMainScene } from 'churaverse-engine-client'

export class ScreenRecordStartMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('screenRecordStart', {})
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    screenRecordStart: ScreenRecordStartMessage
  }
}
