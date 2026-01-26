import { getChuraverseConfig } from '../../churaverseConfig'
import { IEventBus } from '../../eventbus/IEventBus'
import { BaseScene } from '../../scene/IScene/baseScene'
import { Scenes } from '../../scene/types'
import { Store } from '../../store/store'
import { BasePlugin } from './basePlugin/basePlugin'

export class PluginLoader {
  public async loadPlugins<Scene extends Scenes>(
    scene: BaseScene,
    bus: IEventBus<Scene>,
    store: Store<Scene>
  ): Promise<void> {
    const plugins: Array<BasePlugin<Scene>> = []
    Object.entries(getChuraverseConfig().pluginConfig.plugins).forEach(([sceneName, pluginClassList]) => {
      if (sceneName === scene.sceneName) {
        pluginClassList.forEach((PluginClass) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          plugins.push(new PluginClass(store, bus))
        })
      }
    })

    await Promise.all([
      ...plugins.map(async (plugin) => {
        await plugin.loading()
      }),
    ])

    plugins.forEach((plugin) => {
      plugin.listenEvent()
    })
  }
}
