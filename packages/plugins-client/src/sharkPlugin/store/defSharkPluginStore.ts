import { SharkRepository } from '../repository/sharkRepository'
import { ISharkRenderer } from '../domain/ISharkRenderer'
import { ISharkRendererFactory } from '../domain/ISharkRendererFactory'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    sharkPlugin: SharkPluginStore
  }
}

export interface SharkPluginStore {
  readonly sharks: SharkRepository
  readonly sharkRenderers: Map<string, ISharkRenderer>
  readonly sharkRendererFactory: ISharkRendererFactory
}
