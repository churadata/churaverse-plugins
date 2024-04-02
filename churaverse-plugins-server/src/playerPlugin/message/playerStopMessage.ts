import { IMainScene, Direction, Vector } from 'churaverse-engine-server'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

export interface PlayerStopData extends SendableObject {
  stopPos: Vector & SendableObject
  direction: Direction
}

export class PlayerStopMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerStopData) {
    super('playerStop', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    playerStop: PlayerStopMessage
  }
}
