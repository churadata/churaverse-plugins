import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

/**
 * サーバーからクライアントへの録画開始通知メッセージ
 */
export class ScreenRecordStartMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('screenRecordStart', {})
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    screenRecordStart: ScreenRecordStartMessage
  }
}
