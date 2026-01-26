import { Scenes, Store } from 'churaverse-engine-server'
import { NetworkPluginStore } from './defNetworkPluginStore'
import { IMessageSender } from '../interface/IMessageSender'

export function initNetworkPluginStore(store: Store<Scenes>, messageSender: IMessageSender<Scenes>): void {
  const pluginStore: NetworkPluginStore<Scenes> = {
    messageSender,
  }

  store.setInit('networkPlugin', pluginStore)
}
