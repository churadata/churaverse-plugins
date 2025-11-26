import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface UseRevivalItemData extends SendableObject {
  playerId: string
}

export class UseRevivalItemMessage extends BaseMessage<IMainScene> {
  public constructor(public data: UseRevivalItemData) {
    super('useRevivalItem', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    useRevivalItem: UseRevivalItemMessage
  }
}
