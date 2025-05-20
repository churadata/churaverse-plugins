import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface NyokkiTurnStartData extends SendableObject {
  turnNumber: number
}

/**
 * ゲームターン開始を知らせる
 */
export class NyokkiTurnStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiTurnStartData) {
    super('nyokkiTurnStart')
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    nyokkiTurnStart: NyokkiTurnStartMessage
  }
}
