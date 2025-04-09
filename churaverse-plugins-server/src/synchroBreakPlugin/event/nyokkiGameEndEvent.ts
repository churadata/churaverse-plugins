import { CVEvent, IMainScene } from 'churaverse-engine-server'

/**
 * ゲーム終了時のイベント
 */
export class NyokkiGameEndEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('nyokkiGameEnd', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    nyokkiGameEnd: NyokkiGameEndEvent
  }
}
