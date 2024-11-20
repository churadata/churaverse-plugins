import { Store, IMainScene } from 'churaverse-engine-client'
import { SynchroBreakPluginStore } from './defSynchroBreakPluginStore'
import { DescriptionWindow } from '../ui/descriptionWindow/descriptionWindow'

/**
 * SynchroBreakPluginStoreを初期化する関数
 */
export function initSynchroBreakPluginStore(store: Store<IMainScene>): void {
  const synchroBreakPluginStore: SynchroBreakPluginStore = {
    descriptionWindow: new DescriptionWindow(),
    timeLimit: 0,
  }

  store.setInit('synchroBreakPlugin', synchroBreakPluginStore)
}

/**
 * SynchroBreakPluginStoreをリセットする関数
 */
export function resetSynchroBreakPluginStore(store: Store<IMainScene>): void {
  store.reset('synchroBreakPlugin')
}
