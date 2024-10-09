import { IMainScene, Store } from 'churaverse-engine-server'
import { BombRepository } from '../repository/bombRepository'
import { BombPluginStore } from './defBombPluginStore'
import { MapPluginStore } from '@churaverse/map-plugin-server/store/defMapPluginStore'

export function initBombPluginStore(store: Store<IMainScene>): void {
  const mapPluginStore: MapPluginStore = store.of('mapPlugin')
  const bombPluginStore: BombPluginStore = {
    bombs: new BombRepository(mapPluginStore.mapManager.currentMap),
  }

  store.setInit('bombPlugin', bombPluginStore)
}
