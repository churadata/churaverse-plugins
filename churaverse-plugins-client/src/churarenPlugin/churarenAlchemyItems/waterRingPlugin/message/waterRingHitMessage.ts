import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface WaterRingHitData extends SendableObject {
  waterRingId: string
}

export class WaterRingHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: WaterRingHitData) {
    super('waterRingHit', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    waterRingHit: WaterRingHitMessage
  }
}
