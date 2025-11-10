import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import { HealingPotionPlugin } from '@churaverse/churaren-healing-potion-plugin-client'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [HealingPotionPlugin]
