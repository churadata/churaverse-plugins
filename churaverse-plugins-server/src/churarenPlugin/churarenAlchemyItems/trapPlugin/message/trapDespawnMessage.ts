import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface TrapDespawnData extends SendableObject {
  trapId: string
}

export class TrapDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TrapDespawnData) {
    super('trapDespawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    trapDespawn: TrapDespawnMessage
  }
}
