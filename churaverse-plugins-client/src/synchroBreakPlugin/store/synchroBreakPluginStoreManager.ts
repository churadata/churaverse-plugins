import { Store, IMainScene } from 'churaverse-engine-client'
import { SynchroBreakPluginStore } from './defSynchroBreakPluginStore'
import { PlayerNyokkiStatusIcon } from '../ui/synchroBreakIcon/playerNyokkiStatusIcon'
import { PlayersCoinRepository } from '../repository/playersCoinRepository'

/**
 * SynchroBreakPluginStoreを初期化する関数
 */
export function initSynchroBreakPluginStore(store: Store<IMainScene>): void {
  const synchroBreakPluginStore: SynchroBreakPluginStore = {
    synchroBreakIcons: new Map<string, PlayerNyokkiStatusIcon>(),
    playersCoinRepository: new PlayersCoinRepository(),
    timeLimit: undefined,
  }

  store.setInit('synchroBreakPlugin', synchroBreakPluginStore)
}

/**
 * SynchroBreakPluginStoreをリセットする関数
 */
export function resetSynchroBreakPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('synchroBreakPlugin')
}
