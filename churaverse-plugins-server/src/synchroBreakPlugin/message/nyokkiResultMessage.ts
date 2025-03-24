import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface NyokkiResultData extends SendableObject {}

/**
 * ゲームターン終了を知らせる
 */
export class NyokkiResultMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiResultData) {
    super('nyokkiResult', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    nyokkiResult: NyokkiResultMessage
  }
}
