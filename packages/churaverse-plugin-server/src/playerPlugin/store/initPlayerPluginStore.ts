import { PlayerRepository } from '../repository/playerRepository'
import { IMainScene, Store } from 'churaverse-engine-server'
import { PlayerPluginStore } from './defPlayerPluginStore'

export function initPlayerPluginStore(store: Store<IMainScene>): void {
  const playerPluginStore: PlayerPluginStore = {
    players: new PlayerRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('playerPlugin', playerPluginStore)
}
