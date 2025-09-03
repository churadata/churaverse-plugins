import { ExplosionPluginStore } from './defExplosionPluginStore'
import { ExplosionRepository } from '../repository/explosionRepository'
import { IMainScene, Store } from 'churaverse-engine-server'
import '@churaverse/map-plugin-server/store/defMapPluginStore'

export function initExplosionPluginStore(store: Store<IMainScene>): void {
  const explosionPluginStore: ExplosionPluginStore = {
    explosions: new ExplosionRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('explosionPlugin', explosionPluginStore)
}
