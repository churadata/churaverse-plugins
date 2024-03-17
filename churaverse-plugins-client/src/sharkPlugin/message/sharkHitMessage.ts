import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface SharkHitData extends SendableObject {
  sharkId: string
}

export class SharkHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SharkHitData) {
    super('sharkHit', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    sharkHit: SharkHitMessage
  }
}
