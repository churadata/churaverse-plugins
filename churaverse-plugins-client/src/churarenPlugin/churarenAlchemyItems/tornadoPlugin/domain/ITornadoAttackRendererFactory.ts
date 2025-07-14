import { ITornadoAttackRenderer } from './ITornadoAttckRenderer'

export interface ITornadoAttackRendererFactory {
  build: () => ITornadoAttackRenderer
}
