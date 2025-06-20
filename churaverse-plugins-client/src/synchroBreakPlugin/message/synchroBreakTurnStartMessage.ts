import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface SynchroBreakTurnStartData extends SendableObject {
  turnNumber: number
}

/**
 * ゲームターン開始を知らせる
 */
export class SynchroBreakTurnStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakTurnStartData) {
    super('synchroBreakTurnStart')
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    synchroBreakTurnStart: SynchroBreakTurnStartMessage
  }
}
