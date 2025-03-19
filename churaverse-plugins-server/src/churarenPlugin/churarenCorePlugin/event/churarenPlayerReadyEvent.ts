import { CVEvent, IMainScene } from 'churaverse-engine-server'

/**
 * 準備完了ボタンが押された際のイベント
 * @param playerId 準備完了したプレイヤーのID
 */
export class ChurarenPlayerReadyEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('churarenPlayerReady', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    churarenPlayerReady: ChurarenPlayerReadyEvent
  }
}
