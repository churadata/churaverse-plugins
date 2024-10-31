import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface SendBetCoinData extends SendableObject {
  playerId: string
  betCoins: number
}

export class SendBetCoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SendBetCoinData) {
    super('sendBetCoin', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    sendBetCoin: SendBetCoinMessage
  }
}
