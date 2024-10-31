import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export type UiName =
  | 'rankingBoard'
  | 'timeLimit'
  | 'turnSelect'
  | 'betCoin'
  | 'startCountDown'
  | 'nyokkiButton'
  | 'countdownTimer'
  | 'result'

export interface ShowUiData extends SendableObject {
  showUi: UiName
  gameOwner: string
}

export class ShowUiMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ShowUiData) {
    super('showUi', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    showUi: ShowUiMessage
  }
}
