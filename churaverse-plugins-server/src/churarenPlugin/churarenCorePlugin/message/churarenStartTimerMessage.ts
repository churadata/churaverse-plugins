import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

export class ChurarenStartTimerMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('churarenStartTimer')
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    churarenStartTimer: ChurarenStartTimerMessage
  }
}
