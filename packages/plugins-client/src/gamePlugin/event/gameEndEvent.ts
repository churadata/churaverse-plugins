import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

/**
 * ゲーム終了時のイベント
 */
export class GameEndEvent extends CVEvent<IMainScene> {
  public constructor(public readonly gameId: GameIds) {
    super('gameEnd', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameEnd: GameEndEvent
  }
}
