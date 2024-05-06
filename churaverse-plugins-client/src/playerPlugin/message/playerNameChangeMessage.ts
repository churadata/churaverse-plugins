import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { IMainScene } from 'churaverse-engine-client'

export interface PlayerNameChangeData extends SendableObject {
  name: string
}

export class PlayerNameChangeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerNameChangeData) {
    super('playerNameChange', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    playerNameChange: PlayerNameChangeMessage
  }
}
