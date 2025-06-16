import { IMainScene, Store } from 'churaverse-engine-client'
import { IItemRenderer } from '@churaverse/churaren-item-plugin-client/domain/IItemRenderer'
import { PlayerMaterialItemRepository } from '../repository/playerMaterialItemRepository'
import { PlayerItemsStore } from './defPlayerItemsStore'
import { MaterialItemBoxContainer } from '../ui/materialItemBoxContainer/MaterialItemBoxContainer'

export function initPlayerItemStore(store: Store<IMainScene>): void {
  const playerItemStore: PlayerItemsStore = {
    materialItems: new PlayerMaterialItemRepository(),
    materialItemBoxContainer: new MaterialItemBoxContainer(),
    materialItemRenderers: new Map<string, IItemRenderer>(),
    // TODO: AlchemyItemのrepository等の追加
  }

  store.setInit('playerItemStore', playerItemStore)
}

export function resetPlayerItemStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('playerItemStore')
}
