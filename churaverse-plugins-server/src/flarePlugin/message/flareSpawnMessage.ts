import { IMainScene, Direction, Vector } from 'churaverse-engine-server'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

export interface FlareSpawnData extends SendableObject {
  flareId: string
  startPos: Vector & SendableObject
  direction: Direction
  spawnTime: number
}

export class FlareSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: FlareSpawnData) {
    super('flareSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    flareSpawn: FlareSpawnMessage
  }
}
