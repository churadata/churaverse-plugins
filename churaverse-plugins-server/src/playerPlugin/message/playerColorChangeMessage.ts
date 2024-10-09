import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { IMainScene } from 'churaverse-engine-server'
import { PlayerColor } from '../types/playerColor'

export interface PlayerColorChangeData extends SendableObject {
  color: PlayerColor
}

export class PlayerColorChangeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerColorChangeData) {
    super('playerColorChange', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    playerColorChange: PlayerColorChangeMessage
  }
}
