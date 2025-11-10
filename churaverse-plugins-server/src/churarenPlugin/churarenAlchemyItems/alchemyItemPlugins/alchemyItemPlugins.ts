import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server/domain/baseAlchemyItemPlugin'
import { FlamePillarPlugin } from '@churaverse/churaren-flame-pillar-plugin-server'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [FlamePillarPlugin]
