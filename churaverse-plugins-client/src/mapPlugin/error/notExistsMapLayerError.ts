import { MapPluginError } from './mapPluginError'

export class NotExistsMapLayerError extends MapPluginError {
  public constructor(layerName: string) {
    super(`レイヤー:${layerName} は存在しません`)
  }
}
