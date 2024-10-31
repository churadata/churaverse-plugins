import { IMainScene, IEventBus, Store } from 'churaverse-engine-server'
// import { Game } from '../logic/game'
import { NyokkiCollection } from '../repository/nyokkiCollection'
import { SynchroBreakPluginStore } from './defSynchroBreakPluginStore'
import { BetCoinRepository } from '../repository/betCoinRepository'
import { PlayersCoinRepository } from '../repository/playersCoinRepository'

export function initSynchroBreakPluginStore(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>): void {
  const synchroBreakPluginStore: SynchroBreakPluginStore = {
    // game: new Game(eventBus, store),
    nyokkiCollection: new NyokkiCollection(),
    playersCoinRepository: new PlayersCoinRepository(),
    betCoinRepository: new BetCoinRepository(),
    timeLimit: undefined,
    turnSelect: undefined,
    participants: new Map<string, boolean>(),
  }
  store.setInit('synchroBreakPlugin', synchroBreakPluginStore)
}
