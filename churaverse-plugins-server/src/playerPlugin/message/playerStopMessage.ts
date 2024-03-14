import { IMainScene, Direction, Vector } from 'churaverse-engine-server'
import { SendableObject } from '../../networkPlugin/types/sendable'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'

export interface PlayerStopData extends SendableObject {
  stopPos: Vector
  direction: Direction
}

export class PlayerStopMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerStopData) {
    super('playerStop', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    playerStop: PlayerStopMessage
  }
}
