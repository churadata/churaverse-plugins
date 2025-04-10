import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { UpdateChurarenUiType } from '../types/uiTypes'

export interface UpdateChurarenUiData extends SendableObject {
  uiType: UpdateChurarenUiType
}

/**
 * ちゅられんのUIを更新するメッセージ
 * @param uiType 更新するUIの種類
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
