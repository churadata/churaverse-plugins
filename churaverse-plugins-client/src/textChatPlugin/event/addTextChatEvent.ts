import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { TextChat } from '../model/textChat'

export class AddTextChatEvent extends CVEvent<IMainScene> {
  public constructor(public readonly textChat: TextChat, public readonly textColor?: string) {
    super('addTextChat', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    addTextChat: AddTextChatEvent
  }
}
