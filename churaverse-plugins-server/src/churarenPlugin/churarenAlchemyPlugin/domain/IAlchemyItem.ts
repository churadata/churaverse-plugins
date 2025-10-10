import { AlchemyItemRecipe } from '@churaverse/churaren-item-plugin-server/interface/IAlchemyItemRecipe'
import { AlchemyItemKind } from './alchemyItemKind'

export interface IAlchemyItem {
  kind: AlchemyItemKind
  recipe: AlchemyItemRecipe
}
