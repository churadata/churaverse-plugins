import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface GameAbortData extends SendableObject {
  gameId: GameIds
  playerId: string
}

/**
 * クライアントからサーバーへのゲーム中断リクエストメッセージ
 */
export class RequestGameAbortMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameAbortData) {
    super('requestGameAbort', data)
  }
}

/**
 * サーバーからクライアントへのゲーム中断レスポンスメッセージ
 */
export class ResponseGameAbortMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameAbortData) {
    super('responseGameAbort', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    requestGameAbort: RequestGameAbortMessage
    responseGameAbort: ResponseGameAbortMessage
  }
}
