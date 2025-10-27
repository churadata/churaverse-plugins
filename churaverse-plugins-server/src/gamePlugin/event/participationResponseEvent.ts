import { CVEvent, IMainScene } from 'churaverse-engine-server'
import { GameIds } from '../interface/gameIds'

/**
 * ゲーム参加可否レスポンス時のイベント
 */
export class ParticipationResponseEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string,
    public readonly isJoin: boolean
  ) {
    super('participationResponse', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    participationResponse: ParticipationResponseEvent
  }
}
