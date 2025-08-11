import { IItemRenderer } from '../domain/IItemRenderer'
import { IItemRendererFactory } from '../domain/IItemRendererFactory'
import { ItemRepository } from '../repository/itemRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenItemPlugin: ItemPluginStore
  }
}

export interface ItemPluginStore {
  readonly items: ItemRepository
  readonly itemRenderers: Map<string, IItemRenderer>
  readonly itemRendererFactory: IItemRendererFactory
}
