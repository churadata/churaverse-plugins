import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { IMainScene } from 'churaverse-engine-client'

export interface PlayerInvincibleTimeData extends SendableObject {
  playerId: string
  invincibleTime: number
}

export class PlayerInvincibleTimeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerInvincibleTimeData) {
    super('playerInvincibleTime', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    playerInvincibleTime: PlayerInvincibleTimeMessage
  }
}
