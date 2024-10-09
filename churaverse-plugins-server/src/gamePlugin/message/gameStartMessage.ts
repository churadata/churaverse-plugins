import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface GameStartData extends SendableObject {
  playerId: string
  gameName: string
}

/**
 * ゲーム開始を知らせる
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
