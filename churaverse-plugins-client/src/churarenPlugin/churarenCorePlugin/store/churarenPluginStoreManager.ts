import { Store, IMainScene } from 'churaverse-engine-client'
import { ChurarenPluginStore } from './defChurarenStore'


/**
 * churarenPluginStoreを初期化する関数
 */
export function initChurarenPluginStore(store: Store<IMainScene>): void {
  const churarenPluginStore: ChurarenPluginStore = {
    timeLimit: 0,
  }

  store.setInit('churarenPlugin', churarenPluginStore)
}

/**
 * churarenPluginStoreをリセットする関数
 */
export function resetChurarenPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenPlugin')
}
