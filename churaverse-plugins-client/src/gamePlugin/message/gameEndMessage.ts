import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export type FinishStatus = 'normal' | 'abort'

export interface GameEndData extends SendableObject {
  playerId: string
  gameName: string
  finishStatus: FinishStatus
}

/**
 * ゲーム終了のメッセージ
 */
export class GameEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameEndData) {
    super('gameEnd', data)
  }
}

// モジュールの型拡張
declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    gameEnd: GameEndMessage
  }
}
