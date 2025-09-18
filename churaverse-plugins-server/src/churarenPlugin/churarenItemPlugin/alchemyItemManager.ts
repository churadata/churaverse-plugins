import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItemKind'
import { ItemKind } from './domain/itemKind'
import { AlchemyItemRecipe } from './interface/IAlchemyItemRecipe'
import { IAlchemyItemManger } from './interface/IAlchemyItemManger'
import { IAlchemyItemRegister } from './interface/IAlchemyItemRegister'
import { AlchemyItemRegistry } from './alchemyItemRegistry'

export class AlchemyItemManager implements IAlchemyItemRegister, IAlchemyItemManger {
  private readonly alchemyItemRegistry: AlchemyItemRegistry

  public constructor() {
    this.alchemyItemRegistry = new AlchemyItemRegistry()
  }

  public register(recipe: AlchemyItemRecipe, kind: AlchemyItemKind): void {
    switch (recipe.pattern) {
      case 'two_same_one_diff':
        this.alchemyItemRegistry.register(recipe.materialKind, kind, undefined)
        break
      case 'all_same':
        this.alchemyItemRegistry.register(recipe.materialKind, undefined, kind)
        break
    }
  }

  public get(alchemyItemRecipe: AlchemyItemRecipe): AlchemyItemKind {
    const alchemyItem = this.alchemyItemRegistry.get(alchemyItemRecipe)
    return alchemyItem ?? 'blackHole'
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

  private countAlchemyItemKinds(items: ItemKind[]): Map<ItemKind, number> {
    const kindCount = new Map<ItemKind, number>()

    items.forEach((item) => {
      kindCount.set(item, (kindCount.get(item) ?? 0) + 1)
    })

    return kindCount
  }
}
