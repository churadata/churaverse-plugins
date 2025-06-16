import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface ClearAlchemyItemBoxData extends SendableObject {
  playerId: string
}

export class ClearAlchemyItemBoxMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ClearAlchemyItemBoxData) {
    super('clearAlchemyItemBox', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    clearAlchemyItemBox: ClearAlchemyItemBoxMessage
  }
}
