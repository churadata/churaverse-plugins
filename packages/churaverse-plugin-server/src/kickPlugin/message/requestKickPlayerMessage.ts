import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface RequestKickPlayerData extends SendableObject {
  kickedId: string
  kickerId: string
}

export class RequestKickPlayerMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: RequestKickPlayerData) {
    super('requestKickPlayer', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    requestKickPlayer: RequestKickPlayerMessage
  }
}
