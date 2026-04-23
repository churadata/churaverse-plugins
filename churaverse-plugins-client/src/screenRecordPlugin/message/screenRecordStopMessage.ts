import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'

/**
 * サーバーからクライアントへの録画停止通知メッセージ
 */
export class ScreenRecordStopMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('screenRecordStop', {})
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    screenRecordStop: ScreenRecordStopMessage
  }
}
