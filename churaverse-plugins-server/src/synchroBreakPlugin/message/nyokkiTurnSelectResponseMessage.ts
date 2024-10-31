import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface NyokkiTurnSelectResponseData extends SendableObject {
  playerId: string
  turnNumber: number
  allTurn: number
}

export class NyokkiTurnSelectResponseMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiTurnSelectResponseData) {
    super('nyokkiTurnSelectResponse', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    nyokkiTurnSelectResponse: NyokkiTurnSelectResponseMessage
  }
}
