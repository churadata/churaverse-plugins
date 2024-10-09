import { IMainScene, Direction, Vector } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'


export interface PlayerRespawnData extends SendableObject {
  playerId: string
  position: Vector & SendableObject
  direction: Direction
}

export class PlayerRespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerRespawnData) {
    super('playerRespawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    playerRespawn: PlayerRespawnMessage
  }
}
