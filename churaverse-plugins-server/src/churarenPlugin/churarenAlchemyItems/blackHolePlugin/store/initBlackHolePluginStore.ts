import { IMainScene, Store } from 'churaverse-engine-server'
import { BlackHoleRepository } from '../repository/blackHoleRepository'
import { BlackHolePluginStore } from './defBlackHolePluginStore'
import '@churaverse/map-plugin-server/store/defMapPluginStore'

export function initBlackHolePluginStore(store: Store<IMainScene>): void {
  const blackHolePluginStore: BlackHolePluginStore = {
    blackHoles: new BlackHoleRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('churarenBlackHolePlugin', blackHolePluginStore)
}
