import { Vector, Direction, IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface BombSpawnData extends SendableObject {
  bombId: string
  startPos: Vector
  direction: Direction
  spawnTime: number
}

export class BombSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BombSpawnData) {
    super('bombSpawn', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    bombSpawn: BombSpawnMessage
  }
}
