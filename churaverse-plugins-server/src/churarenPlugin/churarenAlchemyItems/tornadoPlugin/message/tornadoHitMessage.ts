import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface TornadoHitData extends SendableObject {
  tornadoId: string
}

export class TornadoHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TornadoHitData) {
    super('tornadoHit', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    tornadoHit: TornadoHitMessage
  }
}
