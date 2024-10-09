import { BasePlugin, IMainScene, Store, IEventBus } from 'churaverse-engine-server'
import { GameStartEvent } from './event/gameStartEvent'
import { GameEndEvent } from './event/gameEndEvent'

export abstract class GamePlugin extends BasePlugin<IMainScene> {
  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>) {
    super(store, bus)
  }

  public abstract gameStart(ev: GameStartEvent): void
  public abstract gameEnd(ev: GameEndEvent): void
}
