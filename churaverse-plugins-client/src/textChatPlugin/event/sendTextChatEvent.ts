import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { TextChat } from '../model/textChat'

export class SendTextChatEvent extends CVEvent<IMainScene> {
  public constructor(public readonly textChat: TextChat) {
    super('sendTextChat', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    sendTextChat: SendTextChatEvent
  }
}
