import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server/domain/baseAlchemyItemPlugin'
import { ExplosionPlugin } from '@churaverse/churaren-explosion-plugin-server'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [ExplosionPlugin]
