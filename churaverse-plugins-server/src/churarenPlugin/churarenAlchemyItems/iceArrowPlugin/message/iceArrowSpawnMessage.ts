import { IMainScene, Direction, Vector } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { Sendable, SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface IceArrowSpawnData extends SendableObject {
  iceArrowId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
  attackVector: Vector & Sendable
}

export class IceArrowSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: IceArrowSpawnData) {
    super('iceArrowSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    iceArrowSpawn: IceArrowSpawnMessage
  }
}
