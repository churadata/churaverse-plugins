import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface SynchroBreakTurnStartData extends SendableObject {
  turnNumber: number
}

/**
 * ゲームターン開始を知らせる
 */
export class SynchroBreakTurnStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakTurnStartData) {
    super('synchroBreakTurnStart', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    synchroBreakTurnStart: SynchroBreakTurnStartMessage
  }
}
