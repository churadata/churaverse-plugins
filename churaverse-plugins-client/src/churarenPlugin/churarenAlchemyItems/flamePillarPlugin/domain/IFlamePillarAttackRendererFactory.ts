import { IFlamePillarAttackRenderer } from './IFlamePillarAttackRenderer'

export interface IFlamePillarAttackRendererFactory {
  build: () => IFlamePillarAttackRenderer
}
