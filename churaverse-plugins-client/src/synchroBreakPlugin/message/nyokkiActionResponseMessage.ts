import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface NyokkiActionResponseData extends SendableObject {
  sameTimePlayersId: string[]
  nyokkiStatus: boolean // trueならばnyokki失敗
  nyokkiLogText: string // ログに流すnyokkiメッセージ
  order: number // ニョッキした順番
}

export class NyokkiActionResponseMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiActionResponseData) {
    super('nyokkiActionResponse', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    nyokkiActionResponse: NyokkiActionResponseMessage
  }
}
