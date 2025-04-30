import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * プレイヤーがニョッキした際のレスポンスイベント
 * @param sameTimePlayersId 同時にニョッキしたプレイヤーのid
 * @param isSuccess ニョッキが成功した場合はtrue, 失敗した場合はfalse
 * @param nyokkiLogText ニョッキのログテキスト
 * @param order ニョッキした順位
 */
export class NyokkiActionResponseEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly sameTimePlayersId: string[],
    public readonly isSuccess: boolean,
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
