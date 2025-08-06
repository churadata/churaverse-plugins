import { IAlchemyItemRenderer } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItemRenderer'

export interface IFlamePillarRendererFactory {
  build: () => IAlchemyItemRenderer
}
