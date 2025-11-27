import { IBlackHoleAttackRenderer } from './IBlackHoleAttackRenderer'

export interface IBlackHoleAttackRendererFactory {
  build: () => IBlackHoleAttackRenderer
}
