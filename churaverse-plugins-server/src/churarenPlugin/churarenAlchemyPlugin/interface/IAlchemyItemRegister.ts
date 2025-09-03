import { AlchemyItem } from '../domain/alchemyItem'
import { AlchemyItemRecipe } from './IAlchemyItem'

export interface IAlchemyItemRegister {
  register: (recipe: AlchemyItemRecipe, result: AlchemyItem) => void
}
