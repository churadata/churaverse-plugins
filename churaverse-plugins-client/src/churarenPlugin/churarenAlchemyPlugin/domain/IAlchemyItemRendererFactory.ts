import { IAlchemyItemRenderer } from './IAlchemyItemRenderer'

export interface IAlchemyItemRendererFactory {
  build: () => IAlchemyItemRenderer
}
