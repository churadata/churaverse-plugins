import { SendableObject } from '../../networkPlugin/types/sendable'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { IMainScene } from 'churaverse-engine-client'
import { PlayerColor } from '../types/playerColor'

export interface PlayerColorChangeData extends SendableObject {
  color: PlayerColor
}

export class PlayerColorChangeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerColorChangeData) {
    super('playerColorChange', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    playerColorChange: PlayerColorChangeMessage
  }
}
