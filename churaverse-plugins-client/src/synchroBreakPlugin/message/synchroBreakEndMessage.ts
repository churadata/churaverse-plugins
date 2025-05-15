import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface SynchroBreakEndData extends SendableObject {
  playerId: string
}

/**
 * ゲーム終了を知らせる
 */
export class SynchroBreakEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakEndData) {
    super('synchroBreakEnd')
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    synchroBreakEnd: SynchroBreakEndMessage
  }
}
