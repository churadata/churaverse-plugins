import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { IMainScene } from 'churaverse-engine-client'

export interface TornadoHitData extends SendableObject {
  tornadoId: string
}

export class TornadoHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TornadoHitData) {
    super('tornadoHit', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    tornadoHit: TornadoHitMessage
  }
}
