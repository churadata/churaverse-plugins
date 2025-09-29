import { IMainScene, Store } from 'churaverse-engine-server'
import { PlayerItemsStore } from './defPlayerItemsStore'
import { PlayerMaterialItemRepository } from '../repository/playerMaterialItemRepository'
import { PlayerAlchemyItemRepository } from '../repository/playerAlchemyItemRepository'

export function initPlayerItemStore(store: Store<IMainScene>): void {
  const playerItemsStore: PlayerItemsStore = {
    materialItems: new PlayerMaterialItemRepository(),
    alchemyItem: new PlayerAlchemyItemRepository(),
  }

  store.setInit('playerItemStore', playerItemsStore)
}

export function resetPlayerItemStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('playerItemStore')
}
