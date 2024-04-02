import { IMainScene, Direction, Vector } from 'churaverse-engine-server'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

export interface SharkSpawnData extends SendableObject {
  sharkId: string
  startPos: Vector & SendableObject
  direction: Direction
  spawnTime: number
}

export class SharkSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SharkSpawnData) {
    super('sharkSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    sharkSpawn: SharkSpawnMessage
  }
}
