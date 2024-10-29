import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface GameAbortData extends SendableObject {
  gameId: GameIds
  playerId: string
}

/**
 * ゲーム中断のメッセージ
 */
export class GameAbortMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameAbortData) {
    super('gameAbort', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    gameAbort: GameAbortMessage
  }
}
