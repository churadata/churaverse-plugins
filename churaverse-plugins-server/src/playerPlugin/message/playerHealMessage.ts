import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface PlayerHealData extends SendableObject {
  playerId: string
  healAmount: number
}

export class PlayerHealMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerHealData) {
    super('playerHeal', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    playerHeal: PlayerHealMessage
  }
}
