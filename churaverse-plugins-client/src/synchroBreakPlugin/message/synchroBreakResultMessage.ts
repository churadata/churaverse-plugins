import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { ResultScreenType } from '../type/resultScreenType'

export interface SynchroBreakResultMessageData extends SendableObject {
  resultScreenType: ResultScreenType
}

/**
 * ゲーム終了後の結果ウィンドウ表示メッセージ
 */
export class SynchroBreakResultMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakResultMessageData) {
    super('synchroBreakResult', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    synchroBreakResult: SynchroBreakResultMessage
  }
}
