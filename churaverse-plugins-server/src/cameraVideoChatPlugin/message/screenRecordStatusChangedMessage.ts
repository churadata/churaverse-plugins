import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface ScreenRecordStatusChangedData extends SendableObject {
  isRecording: boolean
}

/**
 * クライアントからサーバーへの画面録画開始/終了メッセージ
 */
export class ScreenRecordStatusChangedMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ScreenRecordStatusChangedData) {
    super('screenRecordStatusChanged', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    screenRecordStatusChanged: ScreenRecordStatusChangedMessage
  }
}
