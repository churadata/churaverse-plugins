import { IFlareRenderer } from './IFlareRenderer'

export interface IFlareRendererFactory {
  build: () => IFlareRenderer
}
