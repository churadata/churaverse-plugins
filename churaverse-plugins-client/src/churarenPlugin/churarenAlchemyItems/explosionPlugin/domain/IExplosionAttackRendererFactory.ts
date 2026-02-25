import { IExplosionAttackRenderer } from './IExplosionAttckRenderer'

export interface IExplosionAttackRendererFactory {
  build: () => IExplosionAttackRenderer
}
