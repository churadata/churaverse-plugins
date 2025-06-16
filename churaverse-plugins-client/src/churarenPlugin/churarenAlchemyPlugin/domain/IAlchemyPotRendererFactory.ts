import { IAlchemyPotRenderer } from './IAlchemyPotRenderer'

export interface IAlchemyPotRendererFactory {
  build: () => IAlchemyPotRenderer
}
