import { IFlareRepository } from '../domain/IFlareRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    flarePlugin: FlarePluginStore
  }
}

export interface FlarePluginStore {
  readonly flares: IFlareRepository
}
