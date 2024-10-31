import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface NyokkiActionResponseData extends SendableObject {
  sameTimePlayersId: string[]
  nyokkiStatus: boolean // trueならばnyokki(シンクロ)している状態
  nyokkiLogText: string
  order: number
}

export class NyokkiActionResponseMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiActionResponseData) {
    super('nyokkiActionResponse', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    nyokkiActionResponse: NyokkiActionResponseMessage
  }
}
