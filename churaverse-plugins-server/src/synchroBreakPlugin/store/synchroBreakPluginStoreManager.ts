import { Store, IEventBus, IMainScene } from 'churaverse-engine-server'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { GameIds } from '@churaverse/game-plugin-server/interface/gameIds'
import { SynchroBreakPluginStore } from './defSynchroBreakPluginStore'
import { Game } from '../logic/game'
import { NyokkiRepository } from '../repository/nyokkiRepository'
import { BetCoinRepository } from '../repository/betCoinRepository'
import { PlayersCoinRepository } from '../repository/playersCoinRepository'
import { NyokkiLogTextCreate } from '../logic/nyokkiLogTextCreate'

/**
 * SynchroBreakPluginStoreを初期化する関数
 */
export function initSynchroBreakPluginStore(
  gameId: GameIds,
  eventBus: IEventBus<IMainScene>,
  store: Store<IMainScene>
): void {
  const synchroBreakPluginStore: SynchroBreakPluginStore = {
    game: new Game(gameId, eventBus, store),
    nyokkiRepository: new NyokkiRepository(),
    playersCoinRepository: new PlayersCoinRepository(),
    betCoinRepository: new BetCoinRepository(),
    timeLimit: undefined,
    turnSelect: undefined,
    nyokkiLogTextCreate: new NyokkiLogTextCreate(store.of('playerPlugin').players),
  }

  store.setInit('synchroBreakPlugin', synchroBreakPluginStore)
}

/**
 * SynchroBreakPluginStoreをリセットする関数
 */
export function resetSynchroBreakPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('synchroBreakPlugin')
}
