import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'

export class ChurarenStartCountdownMessage extends BaseMessage<IMainScene> {
  public constructor() {
    super('churarenStartCountdown')
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    churarenStartCountdown: ChurarenStartCountdownMessage
  }
}
