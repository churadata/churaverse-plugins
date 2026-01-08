import { ITitleScene, DomManager } from 'churaverse-engine-client'
import { GameModeSelectorComponent } from './gameModeSelectorComponent'

/**
 * ゲームモード選択チェックボックスのID
 */
const GAME_MODE_CHECKBOX_ID = 'game-mode-checkbox'

export class GameModeSelectorRenderer {
  private readonly checkbox?: HTMLInputElement

  public constructor() {
    // チェックボックスの生成
    DomManager.addJsxDom(GameModeSelectorComponent())
    this.checkbox = DomManager.getElementById<HTMLInputElement>(GAME_MODE_CHECKBOX_ID)
  }

  /**
   * ゲームモードが有効かどうかを取得
   * @returns true: ゲームモード, false: 会議モード
   */
  public isGameModeEnabled(): boolean {
    return this.checkbox?.checked ?? false
  }
}

