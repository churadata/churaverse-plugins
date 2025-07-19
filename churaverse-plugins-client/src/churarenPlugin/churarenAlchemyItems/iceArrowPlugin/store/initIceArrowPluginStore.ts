import { IceArrowRepository } from '../repository/iceArrowRepository'
import { IceArrowPluginStore } from './defIceArrowPluginStore'
import { IIceArrowAttackRenderer } from '../domain/IIceArrowAttackRenderer'
import { IIceArrowAttackRendererFactory } from '../domain/IIceArrowAttackRendererFactory'
import { IMainScene, Store } from 'churaverse-engine-client'

export function initIceArrowPluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: IIceArrowAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const iceArrowPluginStore: IceArrowPluginStore = {
    iceArrows: new IceArrowRepository(),
    iceArrowAttackRenderers: new Map<string, IIceArrowAttackRenderer>(),
    iceArrowAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenIceArrowPlugin', iceArrowPluginStore)
}

export function resetIceArrowPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenIceArrowPlugin')
}
