import { IMainScene, Store } from 'churaverse-engine-client'
import { IItemRenderer } from '@churaverse/churaren-item-plugin-client/domain/IItemRenderer'
import { PlayerMaterialItemRepository } from '../repository/playerMaterialItemRepository'
import { PlayerItemsStore } from './defPlayerItemsStore'
import { MaterialItemBoxContainer } from '../ui/materialItemBoxContainer/MaterialItemBoxContainer'
import { PlayerAlchemyItemRepository } from '../repository/playerAlchemyItemRepository'
import { AlchemyItemBoxContainer } from '../ui/alchemyItemBoxContainer/AlchemyItemBoxContainer'
import { IAlchemyItemRenderer } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItemRenderer'

export function initPlayerItemStore(store: Store<IMainScene>): void {
  const playerItemStore: PlayerItemsStore = {
    materialItems: new PlayerMaterialItemRepository(),
    materialItemBoxContainer: new MaterialItemBoxContainer(),
    materialItemRenderers: new Map<string, IItemRenderer>(),
    alchemyItem: new PlayerAlchemyItemRepository(),
    alchemyItemBoxContainer: new AlchemyItemBoxContainer(),
    alchemyItemRenderers: new Map<string, IAlchemyItemRenderer>(),
  }

  store.setInit('playerItemStore', playerItemStore)
}

export function resetPlayerItemStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('playerItemStore')
}
