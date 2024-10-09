import { IMainScene, IEventBus, Store } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { GameStartMessage } from '../message/gameStartMessage'
import { GameEndMessage } from '../message/gameEndMessage'

export abstract class GameSocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public abstract gameStart(ev: GameStartMessage): void
  public abstract gameEnd(ev: GameEndMessage): void
}
