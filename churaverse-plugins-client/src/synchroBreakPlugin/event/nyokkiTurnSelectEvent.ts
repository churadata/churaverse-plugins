import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * ニョッキターン選択イベント
 * @param playerId ゲームのターン数を選択したプレイヤーのID
 * @param allTurn 選択されたゲームターン数
 */
export class NyokkiTurnSelectEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly allTurn: number
  ) {
    super('nyokkiTurnSelect', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiTurnSelect: NyokkiTurnSelectEvent
  }
}
