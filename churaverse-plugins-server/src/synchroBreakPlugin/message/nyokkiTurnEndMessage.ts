import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

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
    super('nyokkiTurnEnd', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    nyokkiTurnEnd: NyokkiTurnEndMessage
  }
}
