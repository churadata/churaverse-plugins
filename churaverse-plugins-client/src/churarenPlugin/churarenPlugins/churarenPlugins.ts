import { ChurarenBossPlugin } from '@churaverse/churaren-boss-plugin-client'
import { ChurarenCorePlugin } from '@churaverse/churaren-core-plugin-client'
import { ChurarenItemPlugin } from '@churaverse/churaren-item-plugin-client'
import { ChurarenPlayerPlugin } from '@churaverse/churaren-player-plugin-client'
import { ChurarenAlchemyPlugin } from '@churaverse/churaren-alchemy-plugin-client'
import '@churaverse/churaren-core-plugin-client/ui/defChurarenUi'
import { ChurarenBossAttackPlugin } from '@churaverse/churaren-boss-attack-plugin-client'
import { alchemyItemPlugins } from '@churaverse/churaren-alchemy-item-plugins-client'
import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'

export const churarenPlugins: Array<typeof BaseGamePlugin> = [
  ChurarenCorePlugin,
  ChurarenBossPlugin,
  ChurarenItemPlugin,
  ChurarenPlayerPlugin,
  ChurarenBossAttackPlugin,
  ChurarenAlchemyPlugin,
  ...alchemyItemPlugins,
]
