import { Store, IMainScene } from 'churaverse-engine-client'
import { GroundScreenRendererFactory } from '../renderer/groundScreenRendererFactory'
import { GroundScreenPluginStore } from './defGroundScreenPluginStore'

export function initGroundScreenPluginStore(
  store: Store<IMainScene>,
  groundScreenRendererFactory: GroundScreenRendererFactory
): void {
  const groundScreenPluginStore: GroundScreenPluginStore = {
    groundScreenRendererFactory,
  }

  store.setInit('groundScreenPlugin', groundScreenPluginStore)
}
