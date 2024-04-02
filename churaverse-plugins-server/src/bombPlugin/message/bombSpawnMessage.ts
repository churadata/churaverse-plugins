import { IMainScene, Direction, Vector } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface BombSpawnData extends SendableObject {
  bombId: string
  startPos: Vector & SendableObject
  direction: Direction
  spawnTime: number
}

export class BombSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BombSpawnData) {
    super('bombSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    bombSpawn: BombSpawnMessage
  }
}
