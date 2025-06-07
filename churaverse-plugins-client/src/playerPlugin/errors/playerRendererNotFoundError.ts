import { PlayerPluginError } from './playerPluginError'

export class PlayerRendererNotFoundError extends PlayerPluginError {
  public constructor() {
    super(`playerRendererが見つかりませんでした。`)
  }
}
