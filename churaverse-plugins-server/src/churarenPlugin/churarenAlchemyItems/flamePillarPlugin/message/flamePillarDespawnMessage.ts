import { IMainScene } from 'churaverse-engine-server'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

export interface FlamePillarDespawnData extends SendableObject {
  flamePillarId: string
}

export class FlamePillarDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlamePillarDespawnData) {
    super('flamePillarDespawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    flamePillarDespawn: FlamePillarDespawnMessage
  }
}
