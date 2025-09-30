import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface ClearAlchemyItemBoxData extends SendableObject {
  playerId: string
}

export class ClearAlchemyItemBoxMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ClearAlchemyItemBoxData) {
    super('clearAlchemyItemBox', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    clearAlchemyItemBox: ClearAlchemyItemBoxMessage
  }
}
