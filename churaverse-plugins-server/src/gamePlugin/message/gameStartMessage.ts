import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface GameStartData extends SendableObject {
  gameId: GameIds
  playerId: string
}

/**
 * ゲーム開始のメッセージ
 */
export class GameStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameStartData) {
    super('gameStart', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    gameStart: GameStartMessage
  }
}
