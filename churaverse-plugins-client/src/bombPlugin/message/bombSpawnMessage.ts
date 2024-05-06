import { Vector, Direction, IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import {  SendableObject } from '@churaverse/network-plugin-client/types/sendable'

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

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    bombSpawn: BombSpawnMessage
  }
}
