import { IMainScene, Direction, Vector } from 'churaverse-engine-server'
import { PlayerColor } from '../types/playerColor'
import { PlayerRole } from '../types/playerRole'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface PlayerJoinData extends SendableObject {
  hp: number
  position: Vector & SendableObject
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

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    playerJoin: PlayerJoinMessage
  }
}
