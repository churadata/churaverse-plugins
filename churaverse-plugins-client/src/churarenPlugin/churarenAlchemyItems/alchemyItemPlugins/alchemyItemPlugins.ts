import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import { BlackHolePlugin } from '../blackHolePlugin/blackHolePlugin'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [BlackHolePlugin]
