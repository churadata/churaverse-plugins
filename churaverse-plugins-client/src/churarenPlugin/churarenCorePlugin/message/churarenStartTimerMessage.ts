import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'

export class ChurarenStartTimerMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('churarenStartTimer')
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    churarenStartTimer: ChurarenStartTimerMessage
  }
}
