import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface SendBetCoinData extends SendableObject {
  playerId: string
  betCoins: number
}

/**
 * プレイヤーが賭けたコイン数を送信するメッセージ
 */
export class SendBetCoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SendBetCoinData) {
    super('sendBetCoin', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    sendBetCoin: SendBetCoinMessage
  }
}
