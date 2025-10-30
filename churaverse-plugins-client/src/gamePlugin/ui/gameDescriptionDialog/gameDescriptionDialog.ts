import { domLayerSetting, DomManager, IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { GameIds } from '../../interface/gameIds'
import { PopupGameDescriptionDialog } from './components/PopupGameDescriptionDialog'
import { GameDescriptionDialogState, IGameDescriptionDialog } from '../../interface/IGameDescriptionDialog'
import { IGameDescriptionDialogManager } from '../../interface/IGameDescriptionDialogManager'
import { ParticipationResponseEvent } from '../../event/participationResponseEvent'

export const GAME_DESCRIPTION_CLOSE_BUTTON_ID = (gameId: GameIds): string => {
  return `game-detail-close-button-${gameId}`
}

export const GAME_DESCRIPTION_CONTAINER_ID = (gameId: GameIds): string => {
  return `game-detail-container-${gameId}`
}

export const GAME_JOIN_BUTTON_ID = (gameId: GameIds): string => {
  return `game-join-button-${gameId}`
}

export const GAME_LEAVE_BUTTON_ID = (gameId: GameIds): string => {
  return `game-leave-button-${gameId}`
}

export const GAME_PARTICIPATION_BUTTONS_CONTAINER_ID = (gameId: GameIds): string => {
  return `game-participation-buttons-container-${gameId}`
}

export abstract class GameDescriptionDialog implements IGameDescriptionDialog {
  private readonly container: HTMLElement
  private readonly gameDescriptionDialogManager: IGameDescriptionDialogManager

  public constructor(
    private readonly bus: IEventBus<IMainScene>,
    private readonly store: Store<IMainScene>,
    private readonly gameId: GameIds,
    gameName: string
  ) {
    this.gameDescriptionDialogManager = store.of('gamePlugin').gameDescriptionDialogManager
    this.container = DomManager.addJsxDom(PopupGameDescriptionDialog({ gameId, gameName }))
    domLayerSetting(this.container, 'higher')
    this.close()
    this.setupCloseButton()
    this.setupParticipationButton()
  }

  public createGameDescription(detail: HTMLElement): void {
    const container = DomManager.getElementById(GAME_DESCRIPTION_CONTAINER_ID(this.gameId))
    container.appendChild(detail)
  }

  public open(state: GameDescriptionDialogState): void {
    this.container.style.display = 'block'
    switch (state) {
      case 'showCloseButton':
        this.showDescriptionButton()
        break
      case 'showParticipationButtons':
        this.showParticipationButtons()
        break
    }
  }

  public close(): void {
    this.container.style.display = 'none'
  }

  private setupCloseButton(): void {
    const closeButton = DomManager.getElementById(GAME_DESCRIPTION_CLOSE_BUTTON_ID(this.gameId))
    closeButton.addEventListener('click', () => {
      this.gameDescriptionDialogManager.closeDialog()
    })
  }

  private setupParticipationButton(): void {
    const joinButton = DomManager.getElementById(GAME_JOIN_BUTTON_ID(this.gameId))
    const leaveButton = DomManager.getElementById(GAME_LEAVE_BUTTON_ID(this.gameId))
    joinButton.addEventListener('click', () => {
      this.postParticipationEvent(true)
      this.gameDescriptionDialogManager.closeDialog()
    })
    leaveButton.addEventListener('click', () => {
      this.postParticipationEvent(false)
      this.gameDescriptionDialogManager.closeDialog()
    })
  }

  private showDescriptionButton(): void {
    const closeButton = DomManager.getElementById(GAME_DESCRIPTION_CLOSE_BUTTON_ID(this.gameId))
    const participantButtons = DomManager.getElementById(GAME_PARTICIPATION_BUTTONS_CONTAINER_ID(this.gameId))
    closeButton.style.display = 'block'
    participantButtons.style.display = 'none'
  }

  private showParticipationButtons(): void {
    const closeButton = DomManager.getElementById(GAME_DESCRIPTION_CLOSE_BUTTON_ID(this.gameId))
    const participantButtons = DomManager.getElementById(GAME_PARTICIPATION_BUTTONS_CONTAINER_ID(this.gameId))
    closeButton.style.display = 'none'
    participantButtons.style.display = 'flex'
  }

  private postParticipationEvent(isJoin: boolean): void {
    this.bus.post(new ParticipationResponseEvent(this.gameId, isJoin))
  }
}
