import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface SubmitGameJoinData extends SendableObject {
  gameId: GameIds
  willJoin: boolean
}

/**
 * クライアントからサーバーへ送信される、ゲーム参加可否メッセージ
 */
export class SubmitGameJoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SubmitGameJoinData) {
    super('submitGameJoin', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    submitGameJoin: SubmitGameJoinMessage
  }
}
