import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface SynchroBreakTurnEndData extends SendableObject {
  noNyokkiPlayerIds: string[]
}

/**
 * ゲームターン終了を知らせる
 */
export class SynchroBreakTurnEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakTurnEndData) {
    super('synchroBreakTurnEnd')
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    synchroBreakTurnEnd: SynchroBreakTurnEndMessage
  }
}
