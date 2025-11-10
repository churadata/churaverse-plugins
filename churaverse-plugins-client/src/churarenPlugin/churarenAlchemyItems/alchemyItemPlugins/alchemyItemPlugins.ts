import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import { HealingPotionPlugin } from '@churaverse/churaren-healing-potion-plugin-client'
import { RevivalItemPlugin } from '@churaverse/churaren-revival-item-plugin-client'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [HealingPotionPlugin, RevivalItemPlugin]
