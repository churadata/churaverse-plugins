import { Vector } from 'churaverse-engine-client'

declare module '@churaverse/map-plugin-client/interface/IMapConfig' {
  export interface MapInfo {
    groundScreenPos?: Vector
  }
}
