import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * ターン開始時のイベント
 * @param turnNumber 現在のゲームターン数
 */
export class NyokkiTurnStartEvent extends CVEvent<IMainScene> {
  public constructor(public readonly turnNumber: number) {
    super('nyokkiTurnStart', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiTurnStart: NyokkiTurnStartEvent
  }
}
