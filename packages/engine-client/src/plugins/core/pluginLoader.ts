import { getChuraverseConfig } from '../..'
import { IEventBus } from '../../eventbus/IEventBus'
import { BaseScene } from '../../scene/IScene/baseScene'
import { Scenes } from '../../scene/types'

import { Store } from '../../store/store'
import { BasePlugin } from './basePlugin/basePlugin'

export class PluginLoader {
  public loadPlugins<Scene extends Scenes>(scene: BaseScene, bus: IEventBus<Scene>, store: Store<Scene>): void {
    const plugins: Array<BasePlugin<Scene>> = []
    Object.entries(getChuraverseConfig().pluginConfig.plugins).forEach(([sceneName, pluginClassList]) => {
      if (sceneName === scene.sceneName) {
        pluginClassList.forEach((PluginClass) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          plugins.push(new PluginClass(store, bus, scene.sceneName))
        })
      }
    })

    plugins.forEach((plugin) => {
      plugin.listenEvent()
    })
  }
}
