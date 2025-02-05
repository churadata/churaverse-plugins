import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface PriorGameData extends SendableObject {
  runningGameId: GameIds
}

/**
 * サーバーから進行中のゲームデータを受け取るメッセージ
 */
export class PriorGameDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PriorGameData) {
    super('priorGameData', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    priorGameData: PriorGameDataMessage
  }
}
