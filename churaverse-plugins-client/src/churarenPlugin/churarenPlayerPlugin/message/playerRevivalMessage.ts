import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { IMainScene } from 'churaverse-engine-client'

export interface PlayerRevivalData extends SendableObject {
  playerId: string
}

export class PlayerRevivalMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerRevivalData) {
    super('playerRevival', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    playerRevival: PlayerRevivalMessage
  }
}
