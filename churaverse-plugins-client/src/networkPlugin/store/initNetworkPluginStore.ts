import { Scene } from 'phaser'
import { Store, IMainScene, SceneUndefinedError, Scenes } from 'churaverse-engine-client'
import { NetworkPluginStore } from './defNetworkPluginStore'
import { IMessageSender } from '../interface/IMessageSender'

export function initNetworkPluginStore(
  store: Store<IMainScene>,
  scene: Scene | undefined,
  messageSender: IMessageSender<IMainScene>,
  socketId: string
): void {
  if (scene === undefined) throw new SceneUndefinedError()

  const pluginStore: NetworkPluginStore<Scenes> = {
    messageSender,
    socketId,
  }

  console.log('initNetworkPluginStore', pluginStore)
  store.setInit('networkPlugin', pluginStore)
}
