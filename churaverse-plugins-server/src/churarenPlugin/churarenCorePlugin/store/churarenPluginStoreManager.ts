import { Store, IMainScene, IEventBus } from 'churaverse-engine-server'
import { ChurarenPluginStore } from './defChurarenPluginStore'
import { ChurarenGameSequence } from '../logic/churarenGameSequence'
import { GameIds } from '@churaverse/game-plugin-server/interface/gameIds'

/**
 * churarenPluginStoreを初期化する関数
 */
export function initChurarenPluginStore(
  gameId: GameIds,
  store: Store<IMainScene>,
  eventBus: IEventBus<IMainScene>
): void {
  const churarenPluginStore: ChurarenPluginStore = {
    churarenGameSequence: new ChurarenGameSequence(gameId, store, eventBus),
  }

  store.setInit('churarenPlugin', churarenPluginStore)
}
