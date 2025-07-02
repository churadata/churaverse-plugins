import { BaseMessage } from "@churaverse/network-plugin-client/message/baseMessage"
import { SendableObject } from "@churaverse/network-plugin-client/types/sendable"
import { IMainScene } from "churaverse-engine-client"


export interface ChurarenItemDespawnData extends SendableObject {
  itemIds: string[]
}

export class ChurarenItemDespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenItemDespawnData) {
    super('churarenItemDespawn', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    churarenItemDespawn: ChurarenItemDespawnMessage
  }
}
