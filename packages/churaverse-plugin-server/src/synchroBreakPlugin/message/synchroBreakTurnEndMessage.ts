import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface SynchroBreakTurnEndData extends SendableObject {
  noNyokkiPlayerIds: string[]
}

/**
 * ゲームターン終了を知らせる
 */
export class SynchroBreakTurnEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SynchroBreakTurnEndData) {
    super('synchroBreakTurnEnd', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    synchroBreakTurnEnd: SynchroBreakTurnEndMessage
  }
}
