import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface NyokkiTurnSelectData extends SendableObject {
  playerId: string
  allTurn: number
}

export class NyokkiTurnSelectMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiTurnSelectData) {
    super('nyokkiTurnSelect', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    nyokkiTurnSelect: NyokkiTurnSelectMessage
  }
}
