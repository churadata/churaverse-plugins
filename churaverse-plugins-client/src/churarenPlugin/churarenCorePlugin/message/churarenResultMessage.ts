import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { ChurarenGameResultType } from '../types/uiTypes'

export interface ChurarenResultData extends SendableObject {
  resultType: ChurarenGameResultType
}

export class ChurarenResultMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenResultData) {
    super('churarenResult', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    churarenResult: ChurarenResultMessage
  }
}
