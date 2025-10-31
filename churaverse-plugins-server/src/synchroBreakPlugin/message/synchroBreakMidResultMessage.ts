import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

/**
 * ゲーム終了後の結果ウィンドウ表示メッセージ
 */
export class SynchroBreakMidResultMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('synchroBreakMidResult')
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    synchroBreakMidResult: SynchroBreakMidResultMessage
  }
}
