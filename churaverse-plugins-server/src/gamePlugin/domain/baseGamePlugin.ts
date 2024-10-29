import { BasePlugin, IMainScene, Store, IEventBus } from 'churaverse-engine-server'
import { GameIds } from '../interface/gameIds'

export abstract class BaseGamePlugin extends BasePlugin<IMainScene> {
  /** ゲーム一意のid */
  protected readonly id: GameIds
  /** ゲーム参加者のプレイヤーid */
  private readonly _participateIds: string[]
  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>, id: GameIds, participateIds: string[]) {
    super(store, bus)
    this.id = id
    this._participateIds = participateIds
  }

  /**
   * ゲーム参加者のプレイヤーidを取得する
   */
  public getParticipateAllId(): string[] {
    return this._participateIds
  }
}
