import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface FlamePillarHitData extends SendableObject {
  flamePillarId: string
}

export class FlamePillarHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlamePillarHitData) {
    super('flamePillarHit', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    flamePillarHit: FlamePillarHitMessage
  }
}
