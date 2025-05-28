import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface FlareHitData extends SendableObject {
  flareId: string
}

export class FlareHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlareHitData) {
    super('flareHit', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    flareHit: FlareHitMessage
  }
}
