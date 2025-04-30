import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface SynchroBreakResultData extends SendableObject {}

/**
 * ゲーム終了後の結果ウィンドウ表示メッセージ
 */
export class SynchroBreakResultMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakResultData) {
    super('synchroBreakResult', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    synchroBreakResult: SynchroBreakResultMessage
  }
}
