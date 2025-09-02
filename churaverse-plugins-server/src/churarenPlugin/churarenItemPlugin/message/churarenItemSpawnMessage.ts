import { IMainScene, Vector } from 'churaverse-engine-server'
import { ItemKind } from '../domain/itemKind'
import { Sendable, SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

export interface ChurarenItemInfo extends SendableObject {
  id: string
  kind: ItemKind
  startPos: Vector & Sendable
  spawnTime: number
}

export type ChurarenItemInfoMap = Record<string, ChurarenItemInfo>

export interface ChurarenItemSpawnData extends SendableObject {
  items: ChurarenItemInfoMap
}

export class ChurarenItemSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenItemSpawnData) {
    super('churarenItemSpawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    churarenItemSpawn: ChurarenItemSpawnMessage
  }
}
