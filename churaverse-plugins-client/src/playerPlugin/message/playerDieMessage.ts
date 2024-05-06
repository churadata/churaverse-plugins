import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface PlayerDieData extends SendableObject {
  targetId: string
}

export class PlayerDieMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerDieData) {
    super('playerDie', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    playerDie: PlayerDieMessage
  }
}
