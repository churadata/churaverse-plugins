import { AlchemyItemRecipe } from './IAlchemyItem'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItemKind'

export interface IAlchemyItemRegister {
  register: (recipe: AlchemyItemRecipe, result: AlchemyItemKind) => void
}
