import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export type FinishState = 'normal' | 'abort'

export interface GameEndData extends SendableObject {
  playerId: string
  gameName: string
  finishState: FinishState
}

/**
 * ゲーム終了を知らせる
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
