import { Store, IMainScene, IEventBus } from 'churaverse-engine-server'
import { ChurarenPluginStore } from './defChurarenPluginStore'
import { ChurarenGameSequence } from '../logic/churarenGameSequence'
import { ReadyPlayerRepository } from '../repository/readyPlayerRepository'

/**
 * churarenPluginStoreを初期化する関数
 */
export function initChurarenPluginStore(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>): void {
  const churarenPluginStore: ChurarenPluginStore = {
    readyPlayers: new ReadyPlayerRepository(),
    churarenGameSequence: new ChurarenGameSequence(store, eventBus),
  }

  store.setInit('churarenPlugin', churarenPluginStore)
}

/**
 * churarenPluginStoreをリセットする関数
 */
export function resetChurarenPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenPlugin')
}
