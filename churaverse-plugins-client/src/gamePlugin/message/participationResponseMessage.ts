import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface ParticipationResponseData extends SendableObject {
  gameId: GameIds
  isJoin: boolean
}

/**
 * クライアントからサーバーへ送信される、ゲーム参加可否メッセージ
 */
export class ParticipationResponseMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ParticipationResponseData) {
    super('participationResponse', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    participationResponse: ParticipationResponseMessage
  }
}
