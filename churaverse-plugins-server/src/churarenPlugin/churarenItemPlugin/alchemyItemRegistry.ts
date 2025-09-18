import { AlchemyItemRecipe } from './interface/IAlchemyItemRecipe'
import { ItemKind } from './domain/itemKind'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItemKind'

export class AlchemyItemRegistry {
  private readonly twoSameOneDiffRecipes = new Map<ItemKind, AlchemyItemKind>()
  private readonly allSameRecipes = new Map<ItemKind, AlchemyItemKind>()

  public register(materialItem: ItemKind, twoSameOneDiff?: AlchemyItemKind, allSame?: AlchemyItemKind): void {
    if (twoSameOneDiff != null) {
      if (this.twoSameOneDiffRecipes.has(materialItem)) {
        throw new Error(
          `Recipe for two_same_one_diff with material ${materialItem} is already registered.` +
            ` Cannot register new item ${twoSameOneDiff}.`
        )
      }
      this.twoSameOneDiffRecipes.set(materialItem, twoSameOneDiff)
    }

    if (allSame != null) {
      if (this.allSameRecipes.has(materialItem)) {
        throw new Error(
          `Recipe for all_same with material ${materialItem} is already registered.` +
            ` Cannot register new item ${allSame}.`
        )
      }
      this.allSameRecipes.set(materialItem, allSame)
    }
  }

  public get(recipe: AlchemyItemRecipe): AlchemyItemKind | undefined {
    switch (recipe.pattern) {
      case 'all_same':
        return this.allSameRecipes.get(recipe.materialKind)
      case 'two_same_one_diff':
        return this.twoSameOneDiffRecipes.get(recipe.materialKind)
      default:
        return undefined
    }
  }
}
