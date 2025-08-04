import { BaseMessage } from "@churaverse/network-plugin-client/message/baseMessage"
import { Sendable, SendableObject } from "@churaverse/network-plugin-client/types/sendable"
import { IMainScene, Vector } from "churaverse-engine-client"

export interface BossSpawnData extends SendableObject {
  bossId: string
  startPos: Vector & Sendable
  spawnTime: number
  bossHp: number
}

export class BossSpawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossSpawnData) {
    super('bossSpawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    bossSpawn: BossSpawnMessage
  }
}
