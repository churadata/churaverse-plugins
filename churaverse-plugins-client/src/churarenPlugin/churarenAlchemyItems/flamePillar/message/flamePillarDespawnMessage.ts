import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { IMainScene } from 'churaverse-engine-client'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface FlamePillarDespawnData extends SendableObject {
  flamePillarId: string
}

export class FlamePillarDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlamePillarDespawnData) {
    super('flamePillarDespawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    flamePillarDespawn: FlamePillarDespawnMessage
  }
}
