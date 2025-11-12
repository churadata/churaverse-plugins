import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import { BlackHolePlugin } from '@churaverse/churaren-black-hole-plugin-client'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [BlackHolePlugin]
