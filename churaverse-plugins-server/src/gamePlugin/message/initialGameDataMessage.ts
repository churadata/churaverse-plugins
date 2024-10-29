import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { GameIds } from '../interface/gameIds'

export interface InitialGameData extends SendableObject {
  runningGameIds: GameIds[]
}

/**
 * サーバーから送信される進行中のゲームデータを保存するメッセージ
 */
export class InitialGameDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: InitialGameData) {
    super('initialGameData', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    initialGameData: InitialGameDataMessage
  }
}
