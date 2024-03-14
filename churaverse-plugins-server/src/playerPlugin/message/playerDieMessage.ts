import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface PlayerDieData extends SendableObject {
  targetId: string
}

export class PlayerDieMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerDieData) {
    super('playerDie', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    playerDie: PlayerDieMessage
  }
}
