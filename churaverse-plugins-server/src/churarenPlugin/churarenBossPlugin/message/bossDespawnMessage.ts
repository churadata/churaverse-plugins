import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { IMainScene } from 'churaverse-engine-server'

export interface DespawnBossData extends SendableObject {
  bossId: string
}

export class BossDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: DespawnBossData) {
    super('bossDespawn', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    bossDespawn: BossDespawnMessage
  }
}
