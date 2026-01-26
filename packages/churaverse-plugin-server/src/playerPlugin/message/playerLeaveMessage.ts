import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface PlayerLeaveData extends SendableObject {
  playerId: string
}

export class PlayerLeaveMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerLeaveData) {
    super('playerLeave', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    playerLeave: PlayerLeaveMessage
  }
}
