import { IMainScene, Direction, Vector } from 'churaverse-engine-server'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

export interface PlayerWalkData extends SendableObject {
  startPos: Vector & SendableObject
  direction: Direction
  speed: number
}

export class PlayerWalkMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerWalkData) {
    super('playerWalk', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    playerWalk: PlayerWalkMessage
  }
}
