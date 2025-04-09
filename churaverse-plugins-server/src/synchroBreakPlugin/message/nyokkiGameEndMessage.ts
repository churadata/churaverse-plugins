import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface NyokkiGameEndData extends SendableObject {
  playerId: string
}

/**
 * ゲーム終了を知らせる
 */
export class NyokkiGameEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiGameEndData) {
    super('nyokkiGameEnd', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    nyokkiGameEnd: NyokkiGameEndMessage
  }
}
