import { IMainScene, Store } from 'churaverse-engine-client'
import { FlamePillarRepository } from '../repository/flamePillarRepository'
import { FlamePillarPluginStore } from './defFlamePillarPluginStore'
import { IFlamePillarAttackRenderer } from '../domain/IFlamePillarAttackRenderer'
import { IFlamePillarAttackRendererFactory } from '../domain/IFlamePillarAttackRendererFactory'

export function initFlamePillarPluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: IFlamePillarAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const flamePillarPluginStore: FlamePillarPluginStore = {
    flamePillars: new FlamePillarRepository(),
    flamePillarAttackRenderers: new Map<string, IFlamePillarAttackRenderer>(),
    flamePillarAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenFlamePillarPlugin', flamePillarPluginStore)
}

export function resetFlamePillarPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenFlamePillarPlugin')
}
