import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface BetTimeRemainingData extends SendableObject {
  remainingTime: number
}

/**
 * ベット残り時間のレスポンスを返すメッセージ
 */
export class BetTimeRemainingMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BetTimeRemainingData) {
    super('betTimeRemaining', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    betTimeRemaining: BetTimeRemainingMessage
  }
}
