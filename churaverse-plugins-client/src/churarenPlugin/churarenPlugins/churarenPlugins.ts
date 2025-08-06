import { ChurarenBossPlugin } from '@churaverse/churaren-boss-plugin-client'
import { ChurarenCorePlugin } from '@churaverse/churaren-core-plugin-client'
import { ChurarenItemPlugin } from '@churaverse/churaren-item-plugin-client'
import { ChurarenPlayerPlugin } from '@churaverse/churaren-player-plugin-client'
import { ChurarenAlchemyPlugin } from '@churaverse/churaren-alchemy-plugin-client'
import '@churaverse/churaren-core-plugin-client/ui/defChurarenUi'
import { alchemyItems } from '@churaverse/churaren-alchemy-items-client'

export const churarenPlugins: any[] = [
  ChurarenCorePlugin,
  ChurarenBossPlugin,
  ChurarenItemPlugin,
  ChurarenPlayerPlugin,
  ChurarenAlchemyPlugin,
  ...alchemyItems,
]
