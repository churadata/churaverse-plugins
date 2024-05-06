import { Sendable, SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { Vector, Direction, IMainScene } from 'churaverse-engine-client'

export interface PlayerRespawnData extends SendableObject {
  playerId: string
  position: Vector & Sendable
  direction: Direction
}

export class PlayerRespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerRespawnData) {
    super('playerRespawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    playerRespawn: PlayerRespawnMessage
  }
}
