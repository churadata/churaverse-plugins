import { IAlchemyItemRenderer } from '../../../churarenAlchemyPlugin/domain/IAlchemyItemRenderer'

export interface IWaterRingRendererFactory {
  build: () => IAlchemyItemRenderer
}
