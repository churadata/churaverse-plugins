import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { GameIds } from '../interface/gameIds'
import { GameState } from '../type/gameState'

export interface PriorGameData extends SendableObject {
  runningGameId: GameIds
  gameState: GameState
}

/**
 * サーバーから進行中のゲームデータを受け取るメッセージ
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
