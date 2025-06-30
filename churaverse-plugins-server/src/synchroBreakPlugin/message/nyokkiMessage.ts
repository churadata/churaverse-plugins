import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

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

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    nyokki: NyokkiMessage
  }
}
