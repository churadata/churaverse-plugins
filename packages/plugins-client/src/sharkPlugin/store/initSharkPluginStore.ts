import { SharkRepository } from '../repository/sharkRepository'
import { Store, IMainScene } from 'churaverse-engine-client'
import { ISharkRenderer } from '../domain/ISharkRenderer'
import { ISharkRendererFactory } from '../domain/ISharkRendererFactory'
import { SharkPluginStore } from './defSharkPluginStore'

export function initSharkPluginStore(
  store: Store<IMainScene>,
  rendererFactory: ISharkRendererFactory | undefined
): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const sharkPluginStore: SharkPluginStore = {
    sharks: new SharkRepository(),
    sharkRenderers: new Map<string, ISharkRenderer>(),
    sharkRendererFactory: rendererFactory,
  }

  store.setInit('sharkPlugin', sharkPluginStore)
}
