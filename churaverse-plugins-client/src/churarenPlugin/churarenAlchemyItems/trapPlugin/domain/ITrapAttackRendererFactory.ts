import { ITrapAttackRenderer } from './ITrapAttackRenderer'

export interface ITrapAttackRendererFactory {
  build: () => ITrapAttackRenderer
}
