import { ChurarenBossPlugin } from '@churaverse/churaren-boss-plugin-server'
import { ChurarenCorePlugin } from '@churaverse/churaren-core-plugin-server'
import '@churaverse/game-plugin-server/store/defGamePluginStore'

export const churarenPlugins = [ChurarenCorePlugin, ChurarenBossPlugin]
