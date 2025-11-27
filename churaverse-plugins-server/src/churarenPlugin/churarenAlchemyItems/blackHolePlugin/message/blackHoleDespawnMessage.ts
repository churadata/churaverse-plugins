import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface BlackHoleDespawnData extends SendableObject {
  blackHoleId: string
}

export class BlackHoleDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BlackHoleDespawnData) {
    super('blackHoleDespawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    blackHoleDespawn: BlackHoleDespawnMessage
  }
}
