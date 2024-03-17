import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface ChangeMapData extends SendableObject {
  mapId: string
}

/**
 * マップ変更時に送信するデータ
 */
export class RequestChangeMapDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChangeMapData) {
    super('requestChangeMapData', data)
  }
}

/**
 * マップ変更完了時に受信するデータ
 */
export class ResponseChangeMapDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChangeMapData) {
    super('responseChangeMapDataMessage', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    requestChangeMapData: RequestChangeMapDataMessage
    responseChangeMapDataMessage: ResponseChangeMapDataMessage
  }
}
