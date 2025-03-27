import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface NyokkiResultData extends SendableObject {}

/**
 * ゲーム終了後の結果ウィンドウ表示メッセージ
 */
export class NyokkiResultMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiResultData) {
    super('nyokkiResult', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    nyokkiResult: NyokkiResultMessage
  }
}
