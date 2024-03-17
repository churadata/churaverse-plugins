import { TransitionManager } from '../transitionManager'
import { Scenes, Store } from 'churaverse-engine-client'
import { TransitionPluginStore } from './defTransitionPluginStore'

export function initTransitionPluginStore<Scene extends Scenes>(
  store: Store<Scenes>,
  transitionManager: TransitionManager<Scene>
): void {
  const transitionPluginStore: TransitionPluginStore<Scenes> = {
    transitionManager,
  }

  store.setInit('transitionPlugin', transitionPluginStore)
}
