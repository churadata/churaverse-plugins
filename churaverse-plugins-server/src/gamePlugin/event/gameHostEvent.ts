import { CVEvent, IMainScene } from 'churaverse-engine-server'
import { GameIds } from '../interface/gameIds'

/**
 * ゲームホスト時のイベント
 */
export class GameHostEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly ownerId: string
  ) {
    super('gameHost', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    gameHost: GameHostEvent
  }
}
