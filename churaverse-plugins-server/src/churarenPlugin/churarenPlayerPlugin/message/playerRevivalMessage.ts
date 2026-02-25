import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface PlayerRevivalData extends SendableObject {
  playerId: string
}

export class PlayerRevivalMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerRevivalData) {
    super('playerRevival', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    playerRevival: PlayerRevivalMessage
  }
}
