import { GamePluginError } from '@churaverse/game-plugin-client/errors/gamePluginError'

export class SynchroBreakUiNotFoundError extends GamePluginError {
  public constructor(componentName: string) {
    super(`[シンクロブレイク] ${componentName}のUIコンポーネントが存在しません`)
  }
}
