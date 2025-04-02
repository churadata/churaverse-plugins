import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * プレイヤーがニョッキした際のレスポンスイベント
 * @param sameTimePlayersId 同時にニョッキしたプレイヤーのid
 * @param nyokkiState ニョッキの成否
 * @param nyokkiLogText ニョッキのログテキスト
 * @param order ニョッキした順位
 */
export class NyokkiActionResponseEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly sameTimePlayersId: string[],
    public readonly nyokkiState: boolean,
    public readonly nyokkiLogText: string,
    public readonly order: number
  ) {
    super('nyokkiActionResponse', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiActionResponse: NyokkiActionResponseEvent
  }
}
