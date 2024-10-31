import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { NyokkiStatus } from '../model/nyokki'

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

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    sendInitUiData: SendInitUiDataMessage
  }
}
