import { ItemKind } from '@churaverse/churaren-item-plugin-server/domain/itemKind'
import { AlchemyItemKind } from '../domain/alchemyItemKind'
import { IAlchemyItemRecipeRepository } from '../interface/IAlchemyItemRecipeRepository'
import { AlchemyItemRecipe } from '../interface/IAlchemyItem'

export class AlchemyItemRecipeRepository implements IAlchemyItemRecipeRepository {
  private readonly recipes = new Map<AlchemyItemRecipe, AlchemyItemKind>()

  public set(recipe: AlchemyItemRecipe, kind: AlchemyItemKind): void {
    this.recipes.set(recipe, kind)
  }

  public get(alchemyItemRecipe: AlchemyItemRecipe): AlchemyItemKind {
    return this.recipes.get(alchemyItemRecipe) ?? 'blackHole'
  }

  public getByMaterialItems(materialItems: ItemKind[]): AlchemyItemKind {
    const countKinds = this.countAlchemyItemKinds(materialItems)
    const itemCount = countKinds.size

    if (itemCount === 1) {
      return this.get({ pattern: 'all_same', materialKind: materialItems[0] })
    } else if (itemCount === 2) {
      const sortedKinds = [...countKinds.entries()].sort((a, b) => b[1] - a[1])
      return this.get({ pattern: 'two_same_one_diff', materialKind: sortedKinds[0][0] as ItemKind })
    } else if (itemCount === 3) {
      return 'blackHole'
    }

    return 'blackHole'
  }

  public clear(): void {
    this.recipes.clear()
  }

  private countAlchemyItemKinds(items: ItemKind[]): Map<AlchemyItemKind, number> {
    const kindCount = new Map<AlchemyItemKind, number>()

    items.forEach((item) => {
      kindCount.set(item, (kindCount.get(item) ?? 0) + 1)
    })

    return kindCount
  }
}
