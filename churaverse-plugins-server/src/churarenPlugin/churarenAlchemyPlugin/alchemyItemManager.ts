import { ITEM_KINDS, ItemKind } from '@churaverse/churaren-item-plugin-server/domain/itemKind'
import { IAlchemyItemManger } from './interface/IAlchemyItemManger'
import { AlchemyItemGenerateType, AlchemyItemRecipe } from './interface/IAlchemyItem'
import { AlchemyItem } from './domain/alchemyItem'
import { IAlchemyItemRegister } from './interface/IAlchemyItemRegister'
import { AlchemyItemKind } from './domain/alchemyItemKind'

export class AlchemyItemManager implements IAlchemyItemRegister, IAlchemyItemManger {
  private readonly recipes = new Map<ItemKind, Map<AlchemyItemGenerateType, AlchemyItem>>()

  public constructor() {
    ITEM_KINDS.forEach((kind) => {
      this.recipes.set(kind, new Map())
    })
  }

  public register(recipe: AlchemyItemRecipe, kind: AlchemyItem): void {
    const pattern = recipe.pattern as AlchemyItemGenerateType
    const existAlchemyItem = this.recipes.get(recipe.materialKind)?.get(pattern)
    if (existAlchemyItem === undefined) {
      this.recipes.set(recipe.materialKind, new Map([[pattern, kind]]))
    }
  }

  public get(alchemyItemRecipe: AlchemyItemRecipe): AlchemyItemKind {
    const alchemyItem = this.recipes
      .get(alchemyItemRecipe.materialKind)
      ?.get(alchemyItemRecipe.pattern as AlchemyItemGenerateType)
    return alchemyItem?.kind ?? ('blackHole' as AlchemyItemKind)
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
      return 'blackHole' as AlchemyItemKind
    }

    return 'blackHole' as AlchemyItemKind
  }

  public clear(): void {
    this.recipes.clear()
  }

  private countAlchemyItemKinds(items: ItemKind[]): Map<ItemKind, number> {
    const kindCount = new Map<ItemKind, number>()

    items.forEach((item) => {
      kindCount.set(item, (kindCount.get(item) ?? 0) + 1)
    })

    return kindCount
  }
}
