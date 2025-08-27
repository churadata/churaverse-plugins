import { DomManager, IMainScene, Store } from 'churaverse-engine-client'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { GameIds } from '../../interface/gameIds'
import { GameState } from '../../type/gameState'
import { IGameDescriptionDialogManager } from '../../interface/IGameDescriptionDialogManager'
import { RequestGameStartMessage } from '../../message/gameStartMessage'
import { RequestGameAbortMessage } from '../../message/gameAbortMessage'
import { IGameSelectionListItemRenderer } from '../../interface/IGameSelectionListItemRenderer'
import { GameSelectionListItem } from './components/GameListComponent'

const DEFAULT_ICON_SIZE = '40px'

export const GAME_LIST_ITEM_ID = (gameId: GameIds): string => {
  return `game-list-item-${gameId}`
}

export const GAME_START_BUTTON_ID = (gameId: GameIds): string => {
  return `start-button-${gameId}`
}

export const GAME_DETAIL_BUTTON_ID = (gameId: GameIds): string => {
  return `detail-button-${gameId}`
}

export const GAME_NAME_DIV_ID = (gameId: GameIds): string => {
  return `game-name-div-${gameId}`
}

export interface GameSelectionListItemProps {
  imagePath: string
  gameId: GameIds
  gameName: string
  width?: string
  height?: string
  /**
   * 数字が大きいほど下に配置される
   */
  order?: number
}

export abstract class GameSelectionListItemRenderer implements IGameSelectionListItemRenderer {
  private readonly networkPlugin: NetworkPluginStore<IMainScene>
  protected readonly gameContainer: HTMLElement
  private currentButtonState: GameState

  public constructor(
    protected readonly store: Store<IMainScene>,
    private readonly gameDetailManager: IGameDescriptionDialogManager,
    private readonly props: GameSelectionListItemProps
  ) {
    this.networkPlugin = this.store.of('networkPlugin')
    this.gameContainer = DomManager.addJsxDom(
      GameSelectionListItem({
        imagePath: props.imagePath,
        gameId: props.gameId,
        gameName: props.gameName,
        width: props.width ?? DEFAULT_ICON_SIZE,
        height: props.height ?? DEFAULT_ICON_SIZE,
        order: props.order ?? 0,
      })
    )
    this.gameContainer.style.order = this.props.order?.toString() ?? '0'

    this.setupGameStartButton()
    this.setupGameDetailButton()
    this.currentButtonState = 'start'
  }

  public get node(): HTMLElement {
    return this.gameContainer
  }

  public get order(): number {
    return Number(this.gameContainer.style.order)
  }

  /**
   * 数字が大きいほど下に配置される
   */
  public set order(value: number) {
    this.gameContainer.style.order = value.toString()
  }

  public onGameStart(gameId: GameIds): void {
    if (this.props.gameId === gameId) {
      this.setGameAbortText()
      this.setGameStatusText()
    } else {
      this.gameStartButtonGrayOut()
    }
  }

  public resetStartButton(): void {
    if (this.currentButtonState === 'abort') {
      const gameNameElement = DomManager.getElementById(GAME_NAME_DIV_ID(this.props.gameId))
      gameNameElement.textContent = `${this.props.gameName}`
    }
    const startButton = DomManager.getElementById<HTMLButtonElement>(GAME_START_BUTTON_ID(this.props.gameId))
    startButton.textContent = '開始'
    startButton.disabled = false
    startButton.style.color = 'white'
    startButton.style.backgroundColor = 'var(--c-primary-deep)'
    startButton.style.border = 'none'
    this.currentButtonState = 'start'
  }

  private setGameAbortText(): void {
    const startButton = DomManager.getElementById<HTMLButtonElement>(GAME_START_BUTTON_ID(this.props.gameId))
    startButton.textContent = '中止'
    startButton.style.color = 'red'
    startButton.style.backgroundColor = 'white'
    startButton.style.border = '1px solid red'
    this.currentButtonState = 'abort'
  }

  private setGameStatusText(): void {
    const gameNameElement = DomManager.getElementById(GAME_NAME_DIV_ID(this.props.gameId))
    gameNameElement.textContent = `🎮 ${this.props.gameName}`
  }

  private gameStartButtonGrayOut(): void {
    const startButton = DomManager.getElementById<HTMLButtonElement>(GAME_START_BUTTON_ID(this.props.gameId))
    startButton.disabled = true
    startButton.style.backgroundColor = 'lightgray'
    startButton.style.color = 'var(--color-button-background)'
    this.currentButtonState = 'other'
  }

  private setupGameStartButton(): void {
    const startButton = DomManager.getElementById<HTMLButtonElement>(GAME_START_BUTTON_ID(this.props.gameId))
    startButton.addEventListener('click', () => {
      if (this.currentButtonState === 'start') {
        this.sendGameStartMessage()
      } else if (this.currentButtonState === 'abort') {
        this.sendGameAbortMessage()
      }
    })
  }

  private setupGameDetailButton(): void {
    const detailButton = DomManager.getElementById<HTMLButtonElement>(GAME_DETAIL_BUTTON_ID(this.props.gameId))
    detailButton.addEventListener('click', () => {
      this.gameDetailManager.showDialog(this.props.gameId)
    })
  }

  private sendGameStartMessage(): void {
    const gameStartMessage = new RequestGameStartMessage({
      gameId: this.props.gameId,
      playerId: this.store.of('playerPlugin').ownPlayerId,
    })
    this.networkPlugin.messageSender.send(gameStartMessage)
  }

  protected sendGameAbortMessage(): void {
    // 中止前に確認ダイアログを表示
    const gamePluginStore = this.store.of('gamePlugin')
    const shouldExit = gamePluginStore.gameExitAlertConfirm.showAlert()
    if (shouldExit) {
      // ユーザーがOKした場合のみ中止メッセージを送信
      const gameAbortMessage = new RequestGameAbortMessage({
        gameId: this.props.gameId,
        playerId: this.store.of('playerPlugin').ownPlayerId,
      })
      this.networkPlugin.messageSender.send(gameAbortMessage)
    }
  }
}
