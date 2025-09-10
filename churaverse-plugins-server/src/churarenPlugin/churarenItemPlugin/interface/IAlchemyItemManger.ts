import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItemKind'
import { ItemKind } from '../domain/itemKind'
import { AlchemyItemRecipe } from './IAlchemyItem'

export interface IAlchemyItemManger {
  get: (alchemyItemRecipe: AlchemyItemRecipe) => AlchemyItemKind
  getByMaterialItems: (materialItems: ItemKind[]) => AlchemyItemKind
}
