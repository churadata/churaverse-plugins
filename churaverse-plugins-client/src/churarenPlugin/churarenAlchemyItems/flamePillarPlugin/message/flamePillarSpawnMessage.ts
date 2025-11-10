import { Direction, Vector, IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject, Sendable } from '@churaverse/network-plugin-client/types/sendable'

export interface FlamePillarSpawnData extends SendableObject {
  flamePillarId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class FlamePillarSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlamePillarSpawnData) {
    super('flamePillarSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    flamePillarSpawn: FlamePillarSpawnMessage
  }
}
