import { BasePlugin, IMainScene, Store, IEventBus } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

export abstract class BaseGamePlugin extends BasePlugin<IMainScene> {
  /** ゲーム一意のid */
  protected readonly id: GameIds
  /** ゲーム名 */
  private readonly _name: string
  /** ゲーム参加者のプレイヤーid */
  private readonly _participateIds: string[]
  /** プレイヤーが途中参加かどうかを示すフラグ */
  private readonly _isMidwayParticipate: boolean
  public constructor(
    store: Store<IMainScene>,
    bus: IEventBus<IMainScene>,
    sceneName: IMainScene['sceneName'],
    id: GameIds,
    name: string,
    participateAllId: string[],
    isMidwayParticipate: boolean
  ) {
    super(store, bus, sceneName)
    this.id = id
    this._name = name
    this._participateIds = participateAllId
    this._isMidwayParticipate = isMidwayParticipate
  }

  /**
   * ゲーム名を取得する
   */
  public getName(): string {
    return this._name
  }

  /**
   * ゲーム参加者のプレイヤーidを取得する
   */
  public getParticipateAllId(): string[] {
    return this._participateIds
  }

  /**
   * プレイヤーが途中参加かどうかを取得する
   */
  public getMidwayParticipate(): boolean {
    return this._isMidwayParticipate
  }
}
