import { Store, IMainScene, IEventBus } from 'churaverse-engine-server'
import { ChurarenPluginStore } from './defChurarenPluginStore'
import { ChurarenGameSequence } from '../logic/churarenGameSequence'

/**
 * churarenPluginStoreを初期化する関数
 */
export function initChurarenPluginStore(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>): void {
  const churarenPluginStore: ChurarenPluginStore = {
    readyPlayers: new Set<string>(),
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
