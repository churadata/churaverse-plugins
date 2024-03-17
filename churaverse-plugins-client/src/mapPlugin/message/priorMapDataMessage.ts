import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

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

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    priorMapData: PriorMapDataMessage
  }
}
