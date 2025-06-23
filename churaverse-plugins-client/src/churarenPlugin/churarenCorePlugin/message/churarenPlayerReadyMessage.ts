import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface ChurarenPlayerReadyData extends SendableObject {
  playerId: string
}

/**
 * 準備完了ボタンが押された際のメッセージ
 */
export class ChurarenPlayerReadyMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenPlayerReadyData) {
    super('churarenPlayerReady', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    churarenPlayerReady: ChurarenPlayerReadyMessage
  }
}
