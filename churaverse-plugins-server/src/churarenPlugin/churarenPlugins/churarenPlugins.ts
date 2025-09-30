import { ChurarenBossPlugin } from '@churaverse/churaren-boss-plugin-server'
import { ChurarenAlchemyPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import { ChurarenCorePlugin } from '@churaverse/churaren-core-plugin-server'
import { ChurarenItemPlugin } from '@churaverse/churaren-item-plugin-server'
import { ChurarenPlayerPlugin } from '@churaverse/churaren-player-plugin-server'
import { ChurarenBossAttackPlugin } from '@churaverse/churaren-boss-attack-plugin-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'

import '@churaverse/game-plugin-server/store/defGamePluginStore'

export const churarenPlugins: Array<typeof BaseGamePlugin> = [
  ChurarenCorePlugin,
  ChurarenBossPlugin,
  ChurarenItemPlugin,
  ChurarenPlayerPlugin,
  ChurarenBossAttackPlugin,
  ChurarenAlchemyPlugin,
  ...alchemyItemPlugins,
]
