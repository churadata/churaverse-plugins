import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import { BlackHolePlugin } from '@churaverse/churaren-black-hole-plugin-client'
import { HealingPotionPlugin } from '@churaverse/churaren-healing-potion-plugin-client'
import { RevivalItemPlugin } from '@churaverse/churaren-revival-item-plugin-client'
import { ExplosionPlugin } from '@churaverse/churaren-explosion-plugin-client'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [
  HealingPotionPlugin,
  RevivalItemPlugin,
  ExplosionPlugin,
  BlackHolePlugin,
]
