import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * ニョッキゲームの開始カウントイベント
 * @param remainingSeconds ゲーム開始までの残り秒数
 */
export class NyokkiGameStartCountEvent extends CVEvent<IMainScene> {
  public constructor(public readonly remainingSeconds: number) {
    super('nyokkiGameStartCount', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiGameStartCount: NyokkiGameStartCountEvent
  }
}
