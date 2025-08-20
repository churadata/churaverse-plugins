import { ItemKind } from '@churaverse/churaren-item-plugin-server/domain/itemKind'
import { AlchemyItemKind, AlchemyItemRecipe } from '../domain/alchemyItemKind'
import { IAlchemyItemRecipeRepository } from '../interface/IAlchemyItemRecipeRepository'

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
    const itemCount = Object.keys(countKinds).length

    if (itemCount === 1) {
      return this.get({ pattern: 'all_same', materialKind: materialItems[0] })
    } else if (itemCount === 2) {
      const [kind1, kind2] = materialItems
      if (countKinds[kind1] === 2 || countKinds[kind2] === 2) {
        return this.get({ pattern: 'two_same_one_diff', materialKind: kind1 === kind2 ? kind1 : kind1 })
      }
    } else if (itemCount === 3) {
      return this.get({ pattern: 'all_diff', materialKind: 'fireOre' })
    }

    return 'blackHole' // Default case if no recipe matches
  }

  public clear(): void {
    this.recipes.clear()
  }

  private countAlchemyItemKinds(items: ItemKind[]): Record<AlchemyItemKind, number> {
    const kindCount: Record<AlchemyItemKind, number> = {}

    items.forEach((item) => {
      if (item in kindCount) {
        kindCount[item] += 1
      } else {
        kindCount[item] = 1
      }
    })

    return kindCount
  }
}
