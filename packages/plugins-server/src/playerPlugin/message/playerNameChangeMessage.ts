import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { IMainScene } from 'churaverse-engine-server'

export interface PlayerNameChangeData extends SendableObject {
  name: string
}

export class PlayerNameChangeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerNameChangeData) {
    super('playerNameChange', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    playerNameChange: PlayerNameChangeMessage
  }
}
