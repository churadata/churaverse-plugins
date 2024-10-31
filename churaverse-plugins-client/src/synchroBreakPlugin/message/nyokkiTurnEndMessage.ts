import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface NyokkiTurnEndData extends SendableObject {
  turnNumber: number
  allTurn: number
  noNyokkiPlayerIds: string[]
}

/**
 * ゲームターン終了を知らせる
 */
export class NyokkiTurnEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiTurnEndData) {
    super('nyokkiTurnEnd')
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    nyokkiTurnEnd: NyokkiTurnEndMessage
  }
}
