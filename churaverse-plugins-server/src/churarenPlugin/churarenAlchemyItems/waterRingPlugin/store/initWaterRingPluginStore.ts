import { Store, IMainScene } from 'churaverse-engine-server'
import { WaterRingPluginStore } from './defWaterRingPluginStore'
import { WaterRingRepository } from '../repository/waterRingRepository'
import '@churaverse/map-plugin-server/store/defMapPluginStore'

export function initWaterRingPluginStore(store: Store<IMainScene>): void {
  const waterRingPluginStore: WaterRingPluginStore = {
    waterRings: new WaterRingRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('waterRingPlugin', waterRingPluginStore)
}
