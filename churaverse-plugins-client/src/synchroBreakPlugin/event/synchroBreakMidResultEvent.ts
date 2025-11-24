import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * ターン終了後の結果ウィンドウ表示イベント
 */
export class SynchroBreakMidResultEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('synchroBreakMidResult', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    synchroBreakMidResult: SynchroBreakMidResultEvent
  }
}
