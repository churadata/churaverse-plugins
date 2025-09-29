import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { AlchemyItemKind } from '../domain/alchemyItemKind'
import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

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

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    alchemize: AlchemizeMessage
  }
}
