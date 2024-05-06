import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { IMainScene, Direction } from 'churaverse-engine-client'

export interface PlayerTurnData extends SendableObject {
  direction: Direction
}

export class PlayerTurnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerTurnData) {
    super('playerTurn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    playerTurn: PlayerTurnMessage
  }
}
