import { ChurarenBossPlugin } from '@churaverse/churaren-boss-plugin-client'
import { ChurarenCorePlugin } from '@churaverse/churaren-core-plugin-client'
import { ChurarenItemPlugin } from '@churaverse/churaren-item-plugin-client'
import { ChurarenPlayerPlugin } from '@churaverse/churaren-player-plugin-client'
import '@churaverse/churaren-core-plugin-client/ui/defChurarenUi'
import { ChurarenBossAttackPlugin } from '@churaverse/churaren-boss-attack-plugin-client'

export const churarenPlugins = [
  ChurarenCorePlugin,
  ChurarenBossPlugin,
  ChurarenItemPlugin,
  ChurarenPlayerPlugin,
  ChurarenBossAttackPlugin,
]
