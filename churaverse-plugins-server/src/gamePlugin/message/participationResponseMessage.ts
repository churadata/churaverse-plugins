import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface ResponseParticipationData extends SendableObject {
  gameId: GameIds
  isJoin: boolean
}

/**
 * クライアントからサーバーへ送信される、ゲーム参加可否メッセージ
 */
export class ParticipationResponseMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ResponseParticipationData) {
    super('participationResponse', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    participationResponse: ParticipationResponseMessage
  }
}
