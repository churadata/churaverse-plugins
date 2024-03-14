import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'
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

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    priorPlayerData: PriorPlayerDataMessage
  }
}
