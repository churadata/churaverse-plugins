import { BaseMessage } from "@churaverse/network-plugin-client/message/baseMessage"
import { SendableObject } from "@churaverse/network-plugin-client/types/sendable"
import { IMainScene } from "churaverse-engine-client"

export interface BossDespawnData extends SendableObject {
  bossId: string
}

export class BossDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: BossDespawnData) {
    super('bossDespawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    bossDespawn: BossDespawnMessage
  }
}
