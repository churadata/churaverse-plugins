import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * ゲーム終了後の結果ウィンドウ表示イベント
 */
export class SynchroBreakResultEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('synchroBreakResult', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    synchroBreakResult: SynchroBreakResultEvent
  }
}
