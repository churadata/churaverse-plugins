import { SceneMap, SceneName } from '../../scene/types'
import { BasePlugin } from './basePlugin/basePlugin'

export interface IPluginConfig {
  plugins: {
    [key in SceneName]: Array<typeof BasePlugin<SceneMap[key]>>
  }
}
