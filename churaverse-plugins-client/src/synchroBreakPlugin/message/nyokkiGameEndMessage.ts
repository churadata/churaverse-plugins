import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface NyokkiGameEndData extends SendableObject {
  playerId: string
}

/**
 * ゲーム終了を知らせる
 */
export class NyokkiGameEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiGameEndData) {
    super('nyokkiGameEnd')
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    nyokkiGameEnd: NyokkiGameEndMessage
  }
}
