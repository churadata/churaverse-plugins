import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface NyokkiTurnSelectData extends SendableObject {
  playerId: string
  allTurn: number
}

/**
 * プレイヤーがゲームターン数を選択した際のメッセージ
 */
export class NyokkiTurnSelectMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiTurnSelectData) {
    super('nyokkiTurnSelect', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    nyokkiTurnSelect: NyokkiTurnSelectMessage
  }
}
