import { ExplosionRepository } from '../repository/explosionRepository'
import { IExplosionAttackRenderer } from '../domain/IExplosionAttckRenderer'
import { IExplosionAttackRendererFactory } from '../domain/IExplosionAttackRendererFactory'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenExplosionPlugin: ExplosionPluginStore
  }
}

export interface ExplosionPluginStore {
  readonly explosions: ExplosionRepository
  readonly explosionAttackRenderers: Map<string, IExplosionAttackRenderer>
  readonly explosionAttackRendererFactory: IExplosionAttackRendererFactory
}
