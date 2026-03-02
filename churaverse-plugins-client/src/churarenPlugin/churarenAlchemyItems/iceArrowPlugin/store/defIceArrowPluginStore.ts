import { IceArrowRepository } from '../repository/iceArrowRepository'
import { IIceArrowAttackRenderer } from '../domain/IIceArrowAttackRenderer'
import { IIceArrowAttackRendererFactory } from '../domain/IIceArrowAttackRendererFactory'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenIceArrowPlugin: IceArrowPluginStore
  }
}

export interface IceArrowPluginStore {
  readonly iceArrows: IceArrowRepository
  readonly iceArrowAttackRenderers: Map<string, IIceArrowAttackRenderer>
  readonly iceArrowAttackRendererFactory: IIceArrowAttackRendererFactory
}
