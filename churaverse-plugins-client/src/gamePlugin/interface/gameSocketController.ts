import { IMainScene, IEventBus, Store } from 'churaverse-engine-client'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { GameStartMessage } from '../message/gameStartMessage'
import { GameEndMessage } from '../message/gameEndMessage'

export abstract class GameSocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public abstract gameStart(message: GameStartMessage): void
  public abstract gameEnd(message: GameEndMessage): void
}
