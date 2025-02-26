import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface UpdatePlayersCoinData extends SendableObject {
  playersCoin: Array<{ playerId: string; coins: number }>
}

export class UpdatePlayersCoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: UpdatePlayersCoinData) {
    super('updatePlayersCoin', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    updatePlayersCoin: UpdatePlayersCoinMessage
  }
}
