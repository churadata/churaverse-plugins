import { SendableObject } from '../../networkPlugin/types/sendable'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { IMainScene } from 'churaverse-engine-client'

export interface PlayerNameChangeData extends SendableObject {
  name: string
}

export class PlayerNameChangeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerNameChangeData) {
    super('playerNameChange', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    playerNameChange: PlayerNameChangeMessage
  }
}
