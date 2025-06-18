import { Store, IMainScene } from 'churaverse-engine-server'
import { SynchroBreakPluginStore } from './defSynchroBreakPluginStore'
import { NyokkiRepository } from '../repository/nyokkiRepository'
import { BetCoinRepository } from '../repository/betCoinRepository'
import { PlayersCoinRepository } from '../repository/playersCoinRepository'

/**
 * SynchroBreakPluginStoreを初期化する関数
 */
export function initSynchroBreakPluginStore(store: Store<IMainScene>): void {
  const synchroBreakPluginStore: SynchroBreakPluginStore = {
    nyokkiRepository: new NyokkiRepository(),
    playersCoinRepository: new PlayersCoinRepository(),
    betCoinRepository: new BetCoinRepository(),
    timeLimit: undefined,
    turnSelect: undefined,
  }

  store.setInit('synchroBreakPlugin', synchroBreakPluginStore)
}

/**
 * SynchroBreakPluginStoreをリセットする関数
 */
export function resetSynchroBreakPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('synchroBreakPlugin')
}
