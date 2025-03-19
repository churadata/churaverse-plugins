import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface NyokkiTurnTimerMessageData extends SendableObject {
  remainingSeconds: number
}

/**
 * ターン進行中の残り時間(秒数)を送信するメッセージ
 */
export class NyokkiTurnTimerMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiTurnTimerMessageData) {
    super('nyokkiTurnTimer', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    nyokkiTurnTimer: NyokkiTurnTimerMessage
  }
}
