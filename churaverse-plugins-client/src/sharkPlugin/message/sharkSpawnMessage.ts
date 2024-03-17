import { IMainScene, Vector, Direction } from 'churaverse-engine-client'
import { SendableObject } from '../../networkPlugin/types/sendable'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'

export interface SharkSpawnData extends SendableObject {
  sharkId: string
  startPos: Vector
  direction: Direction
  spawnTime: number
}

export class SharkSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SharkSpawnData) {
    super('sharkSpawn', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    sharkSpawn: SharkSpawnMessage
  }
}
