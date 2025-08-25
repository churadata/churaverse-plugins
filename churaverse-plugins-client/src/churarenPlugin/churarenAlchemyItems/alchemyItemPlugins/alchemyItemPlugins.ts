import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import { ExplosionPlugin } from '@churaverse/churaren-explosion-plugin-client'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [ExplosionPlugin]
