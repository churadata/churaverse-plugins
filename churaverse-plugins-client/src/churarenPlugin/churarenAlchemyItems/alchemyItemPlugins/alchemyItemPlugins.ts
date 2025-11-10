import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import { FlamePillarPlugin } from '@churaverse/churaren-flame-pillar-plugin-client'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [FlamePillarPlugin]
