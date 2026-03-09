import { IIceArrowAttackRenderer } from './IIceArrowAttackRenderer'

export interface IIceArrowAttackRendererFactory {
  build: () => IIceArrowAttackRenderer
}
