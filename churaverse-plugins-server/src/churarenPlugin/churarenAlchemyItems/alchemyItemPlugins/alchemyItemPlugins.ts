import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server/domain/baseAlchemyItemPlugin'
import { TornadoPlugin } from '@churaverse/churaren-tornado-plugin-server'

export const alchemyItemPlugins: Array<typeof BaseAlchemyItemPlugin> = [TornadoPlugin]
