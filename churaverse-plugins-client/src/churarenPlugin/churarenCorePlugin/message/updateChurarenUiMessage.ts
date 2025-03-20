import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { UpdateChurarenUiType } from '@churaverse/churaren-engine-client/types/uiTypes'

export interface UpdateChurarenUiData extends SendableObject {
  uiType: UpdateChurarenUiType
}

/**
 * 準備完了ボタンが押された際のメッセージ
 */
export class UpdateChurarenUiMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: UpdateChurarenUiData) {
    super('updateChurarenUi', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    updateChurarenUi: UpdateChurarenUiMessage
  }
}
