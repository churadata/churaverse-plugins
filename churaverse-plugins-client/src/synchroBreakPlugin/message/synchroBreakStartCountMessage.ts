import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface SynchroBreakStartCountMessageData extends SendableObject {
  remainingSeconds: number
}

/**
 * シンクロブレイクの開始カウントダウンメッセージ
 */
export class SynchroBreakStartCountMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakStartCountMessageData) {
    super('synchroBreakStartCount', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    synchroBreakStartCount: SynchroBreakStartCountMessage
  }
}
