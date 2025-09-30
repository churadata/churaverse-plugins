import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { AlchemyItemKind } from '../domain/alchemyItemKind'

export interface AlchemizeData extends SendableObject {
  playerId: string
  itemId: string
  kind: AlchemyItemKind
  deletedItemIds: string[]
}

export class AlchemizeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: AlchemizeData) {
    super('alchemize', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    alchemize: AlchemizeMessage
  }
}
