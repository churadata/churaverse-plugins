import { IMainScene, Store } from 'churaverse-engine-server'
import { BombRepository } from '../repository/bombRepository'
import { BombPluginStore } from './defBombPluginStore'

export function initBombPluginStore(store: Store<IMainScene>): void {
  const bombPluginStore: BombPluginStore = {
    bombs: new BombRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('bombPlugin', bombPluginStore)
}
