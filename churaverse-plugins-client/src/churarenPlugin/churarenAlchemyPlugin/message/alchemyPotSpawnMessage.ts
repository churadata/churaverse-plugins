import { IMainScene, Vector } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { Sendable, SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface AlchemyPotInfo extends SendableObject {
  potId: string
  spawnPos: Vector & Sendable
}

export type AlchemyPotMap = Record<string, AlchemyPotInfo>

export interface AlchemyPotSpawnData extends SendableObject {
  pots: AlchemyPotMap
}

export class AlchemyPotSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: AlchemyPotSpawnData) {
    super('alchemyPotSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    alchemyPotSpawn: AlchemyPotSpawnMessage
  }
}
