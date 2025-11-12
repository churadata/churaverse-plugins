import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server/domain/baseAlchemyItemPlugin'
import { BlackHolePlugin } from '@churaverse/churaren-black-hole-plugin-server'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [BlackHolePlugin]
