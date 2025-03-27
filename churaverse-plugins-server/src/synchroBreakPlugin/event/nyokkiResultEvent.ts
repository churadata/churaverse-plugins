import { CVEvent, IMainScene } from 'churaverse-engine-server'

/**
 * ゲーム終了後の結果ウィンドウ表示イベント
 */
export class NyokkiResultEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('nyokkiResult', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    nyokkiResult: NyokkiResultEvent
  }
}
