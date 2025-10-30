import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

/**
 * ゲーム開催イベント
 */
export class GameHostEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly ownerId: string,
    public readonly timeoutSec: number
  ) {
    super('gameHost', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameHost: GameHostEvent
  }
}
