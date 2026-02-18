import { Direction, Vector, IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject, Sendable } from '@churaverse/network-plugin-client/types/sendable'

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

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    iceArrowSpawn: IceArrowSpawnMessage
  }
}
