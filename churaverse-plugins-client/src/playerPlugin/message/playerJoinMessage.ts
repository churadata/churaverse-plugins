import { PlayerColor } from '../types/playerColor'
import { PlayerRole } from '../types/playerRole'
import { Direction, Vector, IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface PlayerJoinData extends SendableObject {
  hp: number
  position: Vector
  direction: Direction
  playerId: string
  heroColor: PlayerColor
  heroName: string
  role: PlayerRole
  spawnTime: number
}

export class PlayerJoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerJoinData) {
    super('playerJoin', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    playerJoin: PlayerJoinMessage
  }
}
