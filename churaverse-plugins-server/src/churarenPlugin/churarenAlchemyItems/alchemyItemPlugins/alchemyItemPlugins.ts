import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server/domain/baseAlchemyItemPlugin'
import { HealingPotionPlugin } from '@churaverse/churaren-healing-potion-plugin-server'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [HealingPotionPlugin]
