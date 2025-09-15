import { domLayerSetting, DomManager, IMainScene, Store } from 'churaverse-engine-client'
import { GamePluginStore } from '../../store/defGamePluginStore'
import { GameIds } from '../../interface/gameIds'
import { PopupGameDescriptionDialog } from './components/PopupGameDescriptionDialog'
import { IGameDescriptionDialog } from '../../interface/IGameDescriptionDialog'

export const GAME_DESCRIPTION_CLOSE_BUTTON_ID = (gameId: GameIds): string => {
  return `game-detail-close-button-${gameId}`
}

export const GAME_DESCRIPTION_CONTAINER_ID = (gameId: GameIds): string => {
  return `game-detail-container-${gameId}`
}

export abstract class GameDescriptionDialog implements IGameDescriptionDialog {
  private readonly container: HTMLElement
  private readonly gamePluginStore: GamePluginStore

  public constructor(
    store: Store<IMainScene>,
    private readonly gameId: GameIds,
    gameName: string
  ) {
    this.gamePluginStore = store.of('gamePlugin')
    this.container = DomManager.addJsxDom(PopupGameDescriptionDialog({ gameId, gameName }))
    domLayerSetting(this.container, 'higher')
    this.close()
    this.setupCloseButton()
  }

  public createGameDescription(detail: HTMLElement): void {
    const container = DomManager.getElementById(GAME_DESCRIPTION_CONTAINER_ID(this.gameId))
    container.appendChild(detail)
  }

  public open(): void {
    this.container.style.display = 'block'
  }

  public close(): void {
    this.container.style.display = 'none'
  }

  private setupCloseButton(): void {
    const closeButton = DomManager.getElementById(GAME_DESCRIPTION_CLOSE_BUTTON_ID(this.gameId))
    closeButton.addEventListener('click', () => {
      this.gamePluginStore.gameDescriptionDialogManager.closeDialog()
    })
  }
}
