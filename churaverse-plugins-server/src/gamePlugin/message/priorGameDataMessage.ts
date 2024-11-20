import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface PriorGameData extends SendableObject {
  runningGameId: GameIds
}

/**
 * サーバーから送信される進行中のゲームデータを保存するメッセージ
 */
export class PriorGameDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PriorGameData) {
    super('priorGameData', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    priorGameData: PriorGameDataMessage
  }
}
