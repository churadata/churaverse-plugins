import { FlareRepository } from '../repository/flareRepository'
import { IFlareRenderer } from '../domain/IFlareRenderer'
import { IFlareRendererFactory } from '../domain/IFlareRendererFactory'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    flarePlugin: FlarePluginStore
  }
}

export interface FlarePluginStore {
  readonly flares: FlareRepository
  readonly flareRenderers: Map<string, IFlareRenderer>
  readonly flareRendererFactory: IFlareRendererFactory
}
