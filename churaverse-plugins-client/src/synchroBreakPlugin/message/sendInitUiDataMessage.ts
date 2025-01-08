import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { NyokkiStatus } from '../type/nyokkiStatus'

export interface InitUiData extends SendableObject {
  playersCoinArray: Array<[string, number]>
  playersBetCoinArray: Array<[string, number]>
  nyokkiStatusArray: Array<[string, NyokkiStatus]>
}

export class SendInitUiDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: InitUiData) {
    super('sendInitUiData', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    sendInitUiData: SendInitUiDataMessage
  }
}
