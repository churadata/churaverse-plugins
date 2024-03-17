import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface PlayerLeaveData extends SendableObject {
  playerId: string
}

export class PlayerLeaveMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerLeaveData) {
    super('playerLeave', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    playerLeave: PlayerLeaveMessage
  }
}
