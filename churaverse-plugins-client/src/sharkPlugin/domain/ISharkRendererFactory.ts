import { ISharkRenderer } from './ISharkRenderer'
export interface ISharkRendererFactory {
  build: () => ISharkRenderer
}
