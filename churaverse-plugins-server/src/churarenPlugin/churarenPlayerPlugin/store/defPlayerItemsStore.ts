import { IPlayerMaterialItemRepository } from '../interface/IPlayerMaterialItemRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    playerItemStore: PlayerItemsStore
  }
}

export interface PlayerItemsStore {
  materialItems: IPlayerMaterialItemRepository
  // TODO: 錬金アイテムのリポジトリを追加
}
