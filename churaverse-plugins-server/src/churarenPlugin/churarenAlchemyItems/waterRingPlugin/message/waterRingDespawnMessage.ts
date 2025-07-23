import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface WaterRingDespawnData extends SendableObject {
  waterRingId: string
}

export class WaterRingDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: WaterRingDespawnData) {
    super('waterRingDespawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    waterRingDespawn: WaterRingDespawnMessage
  }
}
