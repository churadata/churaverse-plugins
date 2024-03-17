import { IEventBus, IMainScene, Scenes, Store } from 'churaverse-engine-client'
import { PlayerListUi } from '../playerListUi'
import { PlayerListPluginStore } from './defPlayerListPluginStore'

export function initPlayerListPluginStore(
  eventBus: IEventBus<Scenes>,
  store: Store<IMainScene>,
  playerListUi: PlayerListUi
): void {
  const pluginStore: PlayerListPluginStore = { playerListUi }
  store.setInit('playerListPlugin', pluginStore)
}
