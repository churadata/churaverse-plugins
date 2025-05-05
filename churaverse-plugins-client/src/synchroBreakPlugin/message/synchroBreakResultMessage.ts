import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface SynchroBreakResultData extends SendableObject {}

/**
 * ゲーム終了後の結果ウィンドウ表示メッセージ
 */
export class SynchroBreakResultMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('synchroBreakResult')
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    synchroBreakResult: SynchroBreakResultMessage
  }
}
