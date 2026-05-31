import { IMainScene, Store } from 'churaverse-engine-client'
import { TrapRepository } from '../repository/trapRepository'
import { TrapPluginStore } from './defTrapPluginStore'
import { ITrapAttackRenderer } from '../domain/ITrapAttackRenderer'
import { ITrapAttackRendererFactory } from '../domain/ITrapAttackRendererFactory'

export function initTrapPluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: ITrapAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const trapPluginStore: TrapPluginStore = {
    traps: new TrapRepository(),
    trapAttackRenderers: new Map<string, ITrapAttackRenderer>(),
    trapAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenTrapPlugin', trapPluginStore)
}

export function resetTrapPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenTrapPlugin')
}
