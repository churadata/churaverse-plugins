import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface GameStartData extends SendableObject {
  playerId: string
  gameName: string
}

/**
 * ゲーム開始のメッセージ
 */
export class GameStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameStartData) {
    super('gameStart', data)
  }
}

// モジュールの型拡張
declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    gameStart: GameStartMessage
  }
}
