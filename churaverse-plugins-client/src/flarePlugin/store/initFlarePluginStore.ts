import { FlareRepository } from '../repository/flareRepository'
import { Store, IMainScene } from 'churaverse-engine-client'
import { IFlareRenderer } from '../domain/IFlareRenderer'
import { IFlareRendererFactory } from '../domain/IFlareRendererFactory'
import { FlarePluginStore } from './defFlarePluginStore'

export function initFlarePluginStore(
  store: Store<IMainScene>,
  rendererFactory: IFlareRendererFactory | undefined
): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const flarePluginStore: FlarePluginStore = {
    flares: new FlareRepository(),
    flareRenderers: new Map<string, IFlareRenderer>(),
    flareRendererFactory: rendererFactory,
  }

  store.setInit('flarePlugin', flarePluginStore)
}
