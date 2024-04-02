import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { PlayerJoinData } from './playerJoinMessage'

export interface ExistPlayers {
  [id: string]: PlayerJoinData
}

/**
 * サーバーから返されるPlayerの初期化データ
 */
export interface PriorPlayerData extends SendableObject {
  existPlayers: ExistPlayers
}

export class PriorPlayerDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PriorPlayerData) {
    super('priorPlayerData', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    priorPlayerData: PriorPlayerDataMessage
  }
}
