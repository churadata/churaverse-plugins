import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface NyokkiTurnStartData extends SendableObject {
  turnNumber: number
}

/**
 * ゲームターン終了を知らせる
 */
export class NyokkiTurnStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiTurnStartData) {
    super('nyokkiTurnStart', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    nyokkiTurnStart: NyokkiTurnStartMessage
  }
}
