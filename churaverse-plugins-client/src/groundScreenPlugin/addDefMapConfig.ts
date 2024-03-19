import { Vector } from 'churaverse-engine-client'

declare module '../mapPlugin/interface/IMapConfig' {
  export interface MapInfoPluginOptions {
    groundScreenPos?: Vector
  }
}
