import { IBossAttackRenderer } from './IBossAttackRenderer'
export interface IBossAttackRendererFactory {
  build: () => IBossAttackRenderer
}
