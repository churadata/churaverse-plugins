import { MapPluginError } from './mapPluginError'

export class NotExistsTilesetImageError extends MapPluginError {
  public constructor(tilesetName: string) {
    super(`タイルセット:${tilesetName} は存在しません`)
  }
}
