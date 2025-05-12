import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'

export class ChurarenStartCountdownMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('churarenStartCountdown')
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    churarenStartCountdown: ChurarenStartCountdownMessage
  }
}
