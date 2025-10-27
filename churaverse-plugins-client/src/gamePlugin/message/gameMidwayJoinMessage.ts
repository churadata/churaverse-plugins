import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface RequestGameMidwayJoinData extends SendableObject {
  gameId: GameIds
}

/**
 * サーバーからクライアントへのゲーム途中参加リクエストメッセージ
 */
export class RequestGameMidwayJoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: RequestGameMidwayJoinData) {
    super('requestGameMidwayJoin', data)
  }
}

export interface ResponseGameMidwayJoinData extends SendableObject {
  gameId: GameIds
  joinPlayerId: string
  participantIds: string[]
}

/**
 * クライアントからサーバーへのゲーム途中参加レスポンスメッセージ
 */
export class ResponseGameMidwayJoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ResponseGameMidwayJoinData) {
    super('responseGameMidwayJoin', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    requestGameMidwayJoin: RequestGameMidwayJoinMessage
    responseGameMidwayJoin: ResponseGameMidwayJoinMessage
  }
}
