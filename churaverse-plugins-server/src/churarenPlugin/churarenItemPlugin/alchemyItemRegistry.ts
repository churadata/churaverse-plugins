import { AlchemyItemRecipe } from './interface/IAlchemyItemRecipe'
import { ItemKind } from './domain/itemKind'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItemKind'

export interface AlchemyItemRecipeRecord {
  allSame: AlchemyItemKind
  twoSameOneDiff: AlchemyItemKind
}

export class AlchemyItemRegistry {
  private readonly alchemyItemRecipes = new Map<string, AlchemyItemRecipeRecord>()
  private allDiffItem: AlchemyItemKind | undefined

  public register(materialItem: ItemKind, recipeRecord: AlchemyItemRecipeRecord): void {
    if (this.alchemyItemRecipes.has(materialItem)) {
      throw new Error(`Already registered material item: ${materialItem}`)
    }
    this.alchemyItemRecipes.set(materialItem, recipeRecord)
  }

  public registerAllDiff(kind: AlchemyItemKind): void {
    this.allDiffItem = kind
  }

  public get(recipe: AlchemyItemRecipe): AlchemyItemKind | undefined {
    if (recipe.pattern === 'all_diff') {
      return this.allDiffItem
    }
    const record = this.alchemyItemRecipes.get(recipe.materialKind)

    switch (recipe.pattern) {
      case 'all_same':
        return record?.allSame
      case 'two_same_one_diff':
        return record?.twoSameOneDiff
    }
  }
}
