import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * ニョッキのターンタイマーイベント
 * @param remainingSeconds ターン終了までの残り秒数
 */
export class NyokkiTurnTimerEvent extends CVEvent<IMainScene> {
  public constructor(public readonly remainingSeconds: number) {
    super('nyokkiTurnTimer', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiTurnTimer: NyokkiTurnTimerEvent
  }
}
