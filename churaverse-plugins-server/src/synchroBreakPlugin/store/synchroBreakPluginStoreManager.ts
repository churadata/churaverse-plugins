import { Store, IEventBus, IMainScene } from 'churaverse-engine-server'
import { SynchroBreakPluginStore } from './defSynchroBreakPluginStore'
import { Game } from '../logic/game'
import { NyokkiCollection } from '../repository/nyokkiCollection'
import { BetCoinRepository } from '../repository/betCoinRepository'
import { PlayersCoinRepository } from '../repository/playersCoinRepository'

/**
 * SynchroBreakPluginStoreを初期化する関数
 */
export function initSynchroBreakPluginStore(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>): void {
  const synchroBreakPluginStore: SynchroBreakPluginStore = {
    game: new Game(eventBus, store),
    nyokkiCollection: new NyokkiCollection(),
    playersCoinRepository: new PlayersCoinRepository(),
    betCoinRepository: new BetCoinRepository(),
    timeLimit: undefined,
    turnSelect: undefined,
    participants: new Map<string, boolean>(),
  }

  store.setInit('synchroBreakPlugin', synchroBreakPluginStore)
}

/**
 * SynchroBreakPluginStoreをリセットする関数
 */
export function resetSynchroBreakPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('synchroBreakPlugin')
}
