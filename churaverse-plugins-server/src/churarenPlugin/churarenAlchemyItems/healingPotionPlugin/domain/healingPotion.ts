import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItem'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server/domain/IAlchemyItem'

export const HEALING_POTION_ITEM: IAlchemyItem = {
  kind: 'healingPotion',
  recipe: {
    pattern: 'two_same_one_diff',
    materialKind: 'herb',
  },
}

export class HealingPotion extends AlchemyItem {
  public constructor(itemId: string) {
    super(itemId, 'healingPotion')
  }
}

declare module '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItemKind' {
  export interface AlchemyItemKindMap {
    healingPotion: HealingPotion
  }
}
