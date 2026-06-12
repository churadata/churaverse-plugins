import { IEventBus, ITitleScene, DomManager } from 'churaverse-engine-client'
import { GameModeSelectorComponent } from '../components/GameModeSelectorComponent'

const GAME_MODE_CHECKBOX_ID = 'game-mode-checkbox'

export class GameModeSelectorRenderer {
  private readonly checkbox?: HTMLInputElement

  public constructor(private readonly eventBus: IEventBus<ITitleScene>) {
    DomManager.addJsxDom(GameModeSelectorComponent())
    this.checkbox = DomManager.getElementById<HTMLInputElement>(GAME_MODE_CHECKBOX_ID)
  }

  public isGameModeEnabled(): boolean {
    return this.checkbox?.checked ?? false
  }
}
