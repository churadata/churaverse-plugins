import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface FlamePillarHitData extends SendableObject {
  flamePillarId: string
}

export class FlamePillarHitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlamePillarHitData) {
    super('flamePillarHit', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    flamePillarHit: FlamePillarHitMessage
  }
}
