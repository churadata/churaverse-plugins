import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { Sendable, SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface TornadoSpawnData extends SendableObject {
  tornadoId: string
  startPos: Vector & Sendable
  direction: Direction
  spawnTime: number
}

export class TornadoSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: TornadoSpawnData) {
    super('tornadoSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    tornadoSpawn: TornadoSpawnMessage
  }
}
