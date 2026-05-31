import { IBlackHoleAttackRendererFactory } from '../domain/IBlackHoleAttackRendererFactory'
import { IBlackHoleAttackRenderer } from '../domain/IBlackHoleAttackRenderer'
import { BlackHoleRepository } from '../repository/blackHoleRepository'
import { BlackHolePluginStore } from './defBlackHolePluginStore'
import { IMainScene, Store } from 'churaverse-engine-client'

export function initBlackHolePluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: IBlackHoleAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const blackHolePluginStore: BlackHolePluginStore = {
    blackHoles: new BlackHoleRepository(),
    blackHoleAttackRenderers: new Map<string, IBlackHoleAttackRenderer>(),
    blackHoleAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenBlackHolePlugin', blackHolePluginStore)
}

export function resetBlackHolePluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenBlackHolePlugin')
}
