import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { Sendable, SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { Direction, IMainScene, Vector } from 'churaverse-engine-server'

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

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    flamePillarSpawn: FlamePillarSpawnMessage
  }
}
