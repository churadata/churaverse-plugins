import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface NyokkiData extends SendableObject {
  playerId: string
}

/**
 * ニョッキアクションを行った際に送信するメッセージ
 */
export class NyokkiMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiData) {
    super('nyokki', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    nyokki: NyokkiMessage
  }
}
