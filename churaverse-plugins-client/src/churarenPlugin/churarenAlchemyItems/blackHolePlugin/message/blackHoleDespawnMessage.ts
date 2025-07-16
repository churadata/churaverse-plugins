import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { IMainScene } from 'churaverse-engine-client'

export interface BlackHoleDespawnData extends SendableObject {
  blackHoleId: string
}

export class BlackHoleDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BlackHoleDespawnData) {
    super('blackHoleDespawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    blackHoleDespawn: BlackHoleDespawnMessage
  }
}
