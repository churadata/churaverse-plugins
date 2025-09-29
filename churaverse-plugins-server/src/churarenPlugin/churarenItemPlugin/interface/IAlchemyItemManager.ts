import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItemKind'
import { ItemKind } from '../domain/itemKind'

export interface IAlchemyItemManager {
  getByMaterialItems: (materialItems: ItemKind[]) => AlchemyItemKind
}
