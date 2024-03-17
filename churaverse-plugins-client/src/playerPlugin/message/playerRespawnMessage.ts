import { SendableObject } from '../../networkPlugin/types/sendable'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { Vector, Direction, IMainScene } from 'churaverse-engine-client'

export interface PlayerRespawnData extends SendableObject {
  playerId: string
  position: Vector
  direction: Direction
}

export class PlayerRespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerRespawnData) {
    super('playerRespawn', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    playerRespawn: PlayerRespawnMessage
  }
}
