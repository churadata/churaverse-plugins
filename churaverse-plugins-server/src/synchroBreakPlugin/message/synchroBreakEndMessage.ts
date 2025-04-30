import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface SynchroBreakEndData extends SendableObject {
  playerId: string
}

/**
 * ゲーム終了を知らせる
 */
export class SynchroBreakEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakEndData) {
    super('synchroBreakEnd', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    synchroBreakEnd: SynchroBreakEndMessage
  }
}
