import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface RequestKickPlayerData extends SendableObject {
  kickedId: string
  kickerId: string
}

export class RequestKickPlayerMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: RequestKickPlayerData) {
    super('requestKickPlayer', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    requestKickPlayer: RequestKickPlayerMessage
  }
}
