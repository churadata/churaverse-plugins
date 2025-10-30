import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

/**
 * ゲーム途中参加イベント
 */
export class GameMidwayJoinEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly joinPlayerId: string,
    public readonly participantIds: string[]
  ) {
    super('gameMidwayJoin', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameMidwayJoin: GameMidwayJoinEvent
  }
}
