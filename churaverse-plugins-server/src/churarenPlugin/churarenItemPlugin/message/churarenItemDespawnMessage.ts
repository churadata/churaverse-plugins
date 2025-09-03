import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface ChurarenItemDespawnData extends SendableObject {
  itemIds: string[]
}

export class ChurarenItemDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenItemDespawnData) {
    super('churarenItemDespawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    churarenItemDespawn: ChurarenItemDespawnMessage
  }
}
