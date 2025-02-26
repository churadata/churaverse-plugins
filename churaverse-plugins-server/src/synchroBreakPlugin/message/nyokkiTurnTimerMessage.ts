import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface NyokkiTurnTimerMessageData extends SendableObject {
  countdown: number
}

export class NyokkiTurnTimerMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiTurnTimerMessageData) {
    super('nyokkiTurnTimer', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    nyokkiTurnTimer: NyokkiTurnTimerMessage
  }
}
