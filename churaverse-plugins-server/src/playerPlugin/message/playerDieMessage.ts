import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface PlayerDieData extends SendableObject {
  targetId: string
}

export class PlayerDieMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerDieData) {
    super('playerDie', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    playerDie: PlayerDieMessage
  }
}
