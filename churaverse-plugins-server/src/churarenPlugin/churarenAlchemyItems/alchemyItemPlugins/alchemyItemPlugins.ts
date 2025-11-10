import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server/domain/baseAlchemyItemPlugin'
import { HealingPotionPlugin } from '@churaverse/churaren-healing-potion-plugin-server'
import { RevivalItemPlugin } from '@churaverse/churaren-revival-item-plugin-server'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [HealingPotionPlugin, RevivalItemPlugin]
