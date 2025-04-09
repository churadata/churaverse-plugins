import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { UpdateChurarenUiType } from '../types/uiTypes'

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

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    updateChurarenUi: UpdateChurarenUiMessage
  }
}
