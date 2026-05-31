import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface WaterRingDespawnData extends SendableObject {
  waterRingId: string
}

export class WaterRingDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: WaterRingDespawnData) {
    super('waterRingDespawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    waterRingDespawn: WaterRingDespawnMessage
  }
}
