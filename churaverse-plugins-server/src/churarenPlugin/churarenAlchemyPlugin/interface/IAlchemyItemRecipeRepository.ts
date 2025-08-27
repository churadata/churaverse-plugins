import { ItemKind } from '@churaverse/churaren-item-plugin-server/domain/itemKind'
import { AlchemyItemKind } from '../domain/alchemyItemKind'
import { AlchemyItemRecipe } from './IAlchemyItem'

export interface IAlchemyItemRecipeRepository {
  set: (recipe: AlchemyItemRecipe, kind: AlchemyItemKind) => void
  get: (alchemyItemRecipe: AlchemyItemRecipe) => AlchemyItemKind
  getByMaterialItems: (materialItems: ItemKind[]) => AlchemyItemKind
  clear: () => void
}
