import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { GameIds } from '../interface/gameIds'
import { ToGameState } from '../type/toGameState'

export interface UpdateGameStateData extends SendableObject {
  gameId: GameIds
  playerId: string
  toState: ToGameState
}

/**
 * ゲームの状態を更新するメッセージ
 */
export class UpdateGameStateMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: UpdateGameStateData) {
    super('updateGameState', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    updateGameState: UpdateGameStateMessage
  }
}
