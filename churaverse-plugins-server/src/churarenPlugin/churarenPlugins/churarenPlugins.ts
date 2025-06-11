import { ChurarenCorePlugin } from '@churaverse/churaren-core-plugin-server'
import { ChurarenItemPlugin } from '@churaverse/churaren-item-plugin-server'
import '@churaverse/game-plugin-server/store/defGamePluginStore'

export const churarenPlugins = [ChurarenCorePlugin, ChurarenItemPlugin]
