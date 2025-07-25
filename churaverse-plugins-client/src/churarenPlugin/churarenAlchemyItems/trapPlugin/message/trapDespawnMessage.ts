import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface TrapDespawnData extends SendableObject {
  trapId: string
}

export class TrapDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TrapDespawnData) {
    super('trapDespawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    trapDespawn: TrapDespawnMessage
  }
}
