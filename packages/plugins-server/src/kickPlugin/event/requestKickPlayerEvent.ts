import { CVEvent, IMainScene } from 'churaverse-engine-server'
import { Player } from '@churaverse/player-plugin-server/domain/player'

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

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    requestKickPlayer: RequestKickPlayerEvent
  }
}
