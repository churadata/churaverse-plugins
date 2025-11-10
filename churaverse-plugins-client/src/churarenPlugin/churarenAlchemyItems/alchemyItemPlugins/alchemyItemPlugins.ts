import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import { TornadoPlugin } from '@churaverse/churaren-tornado-plugin-client'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [TornadoPlugin]
