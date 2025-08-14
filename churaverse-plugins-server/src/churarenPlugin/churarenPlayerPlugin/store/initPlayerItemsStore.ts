import { IMainScene, Store } from 'churaverse-engine-server'
import { PlayerItemsStore } from './defPlayerItemsStore'
import { PlayerMaterialItemRepository } from '../repository/playerMaterialItemRepository'

export function initPlayerItemStore(store: Store<IMainScene>): void {
  const playerItemsStore: PlayerItemsStore = {
    materialItems: new PlayerMaterialItemRepository(),
    // TODO: 錬金アイテムのリポジトリを追加
  }

  store.setInit('playerItemStore', playerItemsStore)
}

export function resetPlayerItemStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('playerItemStore')
}
