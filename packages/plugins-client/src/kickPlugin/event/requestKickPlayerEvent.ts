import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { Player } from '@churaverse/player-plugin-client/domain/player'

/**
 * プレイヤーキック時にpostされるイベント
 */
export class RequestKickPlayerEvent extends CVEvent<IMainScene> {
  public constructor(
    /**
     * キックされるプレイヤー
     */
    public readonly kicked: Player,

    /**
     * キックしたプレイヤー
     */
    public readonly kicker: Player
  ) {
    super('requestKickPlayer', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    requestKickPlayer: RequestKickPlayerEvent
  }
}
