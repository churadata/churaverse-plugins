import { IMainScene, Store } from 'churaverse-engine-client'
import { WaterRingRepository } from '../repository/waterRingRepository'
import { WaterRingPluginStore } from './defWaterRingPluginStore'
import { IWaterRingAttackRenderer } from '../domain/IWaterRingAttackRenderer'
import { IWaterRingAttackRendererFactory } from '../domain/IWaterRingAttackRendererFactory'

export function initWaterRingPluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: IWaterRingAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const waterRingPluginStore: WaterRingPluginStore = {
    waterRings: new WaterRingRepository(),
    waterRingAttackRenderers: new Map<string, IWaterRingAttackRenderer>(),
    waterRingAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenWaterRingPlugin', waterRingPluginStore)
}

export function resetWaterRingPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenWaterRingPlugin')
}
