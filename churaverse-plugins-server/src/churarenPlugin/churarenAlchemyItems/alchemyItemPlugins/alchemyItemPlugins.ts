import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { HealingPotionPlugin } from '@churaverse/churaren-healing-potion-plugin-server'

export const alchemyItemPlugins: Array<typeof BaseGamePlugin> = [HealingPotionPlugin]
