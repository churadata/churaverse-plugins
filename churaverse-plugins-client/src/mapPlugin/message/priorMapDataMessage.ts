import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

/**
 * サーバーから返されるMapの初期化データ
 */
export interface PriorMapData extends SendableObject {
  mapId: string
}

export class PriorMapDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PriorMapData) {
    super('priorMapData', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    priorMapData: PriorMapDataMessage
  }
}
