import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface ChangePlayersCoinData extends SendableObject {
  playerId: string
  coins: number
}

export class ChangePlayersCoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChangePlayersCoinData) {
    super('changePlayersCoin', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    changePlayersCoin: ChangePlayersCoinMessage
  }
}
