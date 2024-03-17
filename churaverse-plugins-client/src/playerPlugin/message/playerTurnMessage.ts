import { SendableObject } from '../../networkPlugin/types/sendable'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { IMainScene, Direction } from 'churaverse-engine-client'

export interface PlayerTurnData extends SendableObject {
  direction: Direction
}

export class PlayerTurnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerTurnData) {
    super('playerTurn', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    playerTurn: PlayerTurnMessage
  }
}
