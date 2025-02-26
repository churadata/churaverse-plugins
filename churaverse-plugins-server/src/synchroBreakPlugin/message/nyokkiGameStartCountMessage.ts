import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface NyokkiGameStartCountMessageData extends SendableObject {
  countdown: number
}

export class NyokkiGameStartCountMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiGameStartCountMessageData) {
    super('nyokkiGameStartCount', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    nyokkiGameStartCount: NyokkiGameStartCountMessage
  }
}
