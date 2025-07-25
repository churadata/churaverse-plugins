import { CVEvent, IMainScene } from 'churaverse-engine-server'

/**
 * プレイヤーがゲームターン数を選択した際のイベント
 * @param allTurn 選択されたゲームターン数
 */
export class SynchroBreakTurnSelectEvent extends CVEvent<IMainScene> {
  public constructor(public readonly allTurn: number) {
    super('synchroBreakTurnSelect', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    synchroBreakTurnSelect: SynchroBreakTurnSelectEvent
  }
}
