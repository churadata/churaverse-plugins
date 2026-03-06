import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface IceArrowHitData extends SendableObject {
  iceArrowId: string
}

export class IceArrowHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: IceArrowHitData) {
    super('iceArrowHit', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    iceArrowHit: IceArrowHitMessage
  }
}
