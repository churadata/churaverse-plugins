import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface GameAbortData extends SendableObject {
  gameId: GameIds
  playerId: string
}

/**
 * サーバーからクライアントへのゲーム中断リクエストメッセージ
 */
export class RequestGameAbortMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameAbortData) {
    super('requestGameAbort', data)
  }
}

/**
 * クライアントからサーバーへのゲーム中断レスポンスメッセージ
 */
export class ResponseGameAbortMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameAbortData) {
    super('responseGameAbort', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    requestGameAbort: RequestGameAbortMessage
    responseGameAbort: ResponseGameAbortMessage
  }
}
