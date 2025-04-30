import { CVEvent, IMainScene } from 'churaverse-engine-server'

/**
 * ゲーム終了後の結果ウィンドウ表示イベント
 */
export class SynchroBreakResultEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('synchroBreakResult', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    synchroBreakResult: SynchroBreakResultEvent
  }
}
