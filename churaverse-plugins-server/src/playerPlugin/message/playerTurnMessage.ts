import { IMainScene, Direction } from 'churaverse-engine-server'
import { SendableObject } from '../../networkPlugin/types/sendable'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'

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
