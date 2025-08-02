import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface BetTimeRemainingData extends SendableObject {
  remainingTime: number
}

/**
 * ベットタイム残りのメッセージ
 */
export class BetTimeRemainingMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BetTimeRemainingData) {
    super('betTimeRemaining', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    betTimeRemaining: BetTimeRemainingMessage
  }
}
