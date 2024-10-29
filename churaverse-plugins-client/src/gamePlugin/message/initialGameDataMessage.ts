import { IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'
import { GameIds } from '../interface/gameIds'

/**
 * サーバーから受け取る進行中のゲームデータを保存するメッセージ
 */
export interface InitialGameData extends SendableObject {
  runningGameIds: GameIds[]
}

export class InitialGameDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: InitialGameData) {
    super('initialGameData', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    initialGameData: InitialGameDataMessage
  }
}
