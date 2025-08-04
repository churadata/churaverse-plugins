import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { IMainScene } from 'churaverse-engine-client'

export interface UseRevivalItemData extends SendableObject {
  playerId: string
}

export class UseRevivalItemMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: UseRevivalItemData) {
    super('useRevivalItem', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    useRevivalItem: UseRevivalItemMessage
  }
}
