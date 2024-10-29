import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface GameEndData extends SendableObject {
  gameId: GameIds
}

/**
 * ゲーム終了のメッセージ
 */
export class GameEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameEndData) {
    super('gameEnd', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    gameEnd: GameEndMessage
  }
}