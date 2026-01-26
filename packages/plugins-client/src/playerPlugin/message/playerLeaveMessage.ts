import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface PlayerLeaveData extends SendableObject {
  playerId: string
}

export class PlayerLeaveMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerLeaveData) {
    super('playerLeave', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    playerLeave: PlayerLeaveMessage
  }
}
