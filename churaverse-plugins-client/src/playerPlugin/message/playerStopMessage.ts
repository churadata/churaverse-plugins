import { Vector, Direction, IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { Sendable, SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface PlayerStopData extends SendableObject {
  stopPos: Vector & Sendable
  direction: Direction
}

export class PlayerStopMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerStopData) {
    super('playerStop', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    playerStop: PlayerStopMessage
  }
}
