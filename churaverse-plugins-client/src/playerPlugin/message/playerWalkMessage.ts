import { Vector, IMainScene, Direction } from 'churaverse-engine-client'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface PlayerWalkData extends SendableObject {
  startPos: Vector
  direction: Direction
  speed: number
}

export class PlayerWalkMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerWalkData) {
    super('playerWalk', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    playerWalk: PlayerWalkMessage
  }
}
