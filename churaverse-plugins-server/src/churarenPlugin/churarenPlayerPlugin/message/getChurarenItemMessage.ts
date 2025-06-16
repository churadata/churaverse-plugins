import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface GetChurarenItemData extends SendableObject {
  playerId: string
  itemId: string
}

export class GetChurarenItemMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GetChurarenItemData) {
    super('getChurarenItem', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    getChurarenItem: GetChurarenItemMessage
  }
}
