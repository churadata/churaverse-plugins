import { TornadoRepository } from '../repository/tornadoRepository'
import { TornadoPluginStore } from './defTornadoPluginStore'
import { ITornadoAttackRenderer } from '../domain/ITornadoAttckRenderer'
import { ITornadoAttackRendererFactory } from '../domain/ITornadoAttackRendererFactory'
import { IMainScene, Store } from 'churaverse-engine-client'

export function initTornadoPluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: ITornadoAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const tornadoPluginStore: TornadoPluginStore = {
    tornados: new TornadoRepository(),
    tornadoAttackRenderers: new Map<string, ITornadoAttackRenderer>(),
    tornadoAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenTornadoPlugin', tornadoPluginStore)
}

export function resetTornadoPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenTornadoPlugin')
}
