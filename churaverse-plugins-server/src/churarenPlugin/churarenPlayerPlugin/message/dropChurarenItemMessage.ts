import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface DropChurarenItemData extends SendableObject {
  playerId: string
  itemId: string
}

export class DropChurarenItemMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: DropChurarenItemData) {
    super('dropChurarenItem', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    dropChurarenItem: DropChurarenItemMessage
  }
}
