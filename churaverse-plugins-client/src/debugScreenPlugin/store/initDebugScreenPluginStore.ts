import { IEventBus } from '../../../eventbus/IEventBus'
import { IMainScene } from '../../../scene/IScene/IMainScene'
import { Store } from '../../store/store'
import { DebugDetailScreenContainer } from '../debugScreen/debugDetailScreenContainer'
import { DebugSummaryScreenContainer } from '../debugScreen/debugSummaryScreenContainer'
import { DebugScreenPluginStore } from './defDebugScreenPluginStore'

export function initDebugScreenPluginStore(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>): void {
  const debugScreenPluginStore: DebugScreenPluginStore = {
    debugSummaryScreenContainer: new DebugSummaryScreenContainer(eventBus),
    debugDetailScreenContainer: new DebugDetailScreenContainer(),
  }

  store.setInit('debugScreenPlugin', debugScreenPluginStore)
}