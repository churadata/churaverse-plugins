import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface GameStartData extends SendableObject {
  gameId: GameIds
  playerId: string
}

/**
 * クライアントからサーバーへのゲーム開始リクエストメッセージ
 */
export class RequestGameStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameStartData) {
    super('requestGameStart', data)
  }
}

/**
 * サーバーからクライアントへのゲーム開始レスポンスメッセージ
 */
export class ResponseGameStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameStartData) {
    super('responseGameStart', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    requestGameStart: RequestGameStartMessage
    responseGameStart: ResponseGameStartMessage
  }
}
