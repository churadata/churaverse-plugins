import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface SendBetCoinResponseData extends SendableObject {
  playerId: string
  betCoins: number
  currentCoins: number
}

/**
 * プレイヤーが賭けたコイン数と現在の所持コイン数を送信するメッセージ
 */
export class SendBetCoinResponseMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SendBetCoinResponseData) {
    super('sendBetCoinResponse', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    sendBetCoinResponse: SendBetCoinResponseMessage
  }
}
