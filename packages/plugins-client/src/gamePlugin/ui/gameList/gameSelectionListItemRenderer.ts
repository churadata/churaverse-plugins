import { DomManager, IMainScene, Store } from 'churaverse-engine-client'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { GameIds } from '../../interface/gameIds'
import { GameState } from '../../type/gameState'
import { RequestGameAbortMessage } from '../../message/gameAbortMessage'
import { IGameSelectionListItemRenderer, StartButtonState } from '../../interface/IGameSelectionListItemRenderer'
import { GameSelectionListItem } from './components/GameListComponent'
import { RequestGameHostMessage } from '../../message/gameHostMessage'
import { GamePolicy } from '../../interface/gamePolicy'
import { RequestGameMidwayJoinMessage } from '../../message/gameMidwayJoinMessage'

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
  private currentButtonState: StartButtonState

  public constructor(
    private readonly store: Store<IMainScene>,
    private readonly gamePolicy: GamePolicy,
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

  public onPriorGameData(gameId: GameIds, gameState: GameState): void {
    if (this.props.gameId !== gameId) {
      this.gameStartButtonGrayOut()
      return
    }

    this.setGameStatusText()
    if (gameState === 'host') {
      this.setGameHostText()
    } else if (gameState === 'start') {
      this.setPlayingGameText()
    }
  }

  public onGameHost(gameId: GameIds): void {
    if (this.props.gameId !== gameId) {
      this.gameStartButtonGrayOut()
      return
    }

    this.setGameHostText()
    this.setGameStatusText()
  }

  public onGameStart(gameId: GameIds, isJoined: boolean): void {
    if (this.props.gameId !== gameId) {
      this.gameStartButtonGrayOut()
      return
    }

    this.setGameStatusText()
    if (isJoined) {
      this.setGameAbortText()
    } else {
      this.setPlayingGameText()
    }
  }

  public resetStartButton(): void {
    if (this.currentButtonState !== 'inactive') {
      const gameNameElement = DomManager.getElementById(GAME_NAME_DIV_ID(this.props.gameId))
      gameNameElement.textContent = `${this.props.gameName}`
    }
    const startButton = DomManager.getElementById<HTMLButtonElement>(GAME_START_BUTTON_ID(this.props.gameId))
    startButton.textContent = '開始'
    startButton.disabled = false
    this.currentButtonState = 'start'
    this.styleButtonStart(startButton)
  }

  private setGameHostText(): void {
    const startButton = DomManager.getElementById<HTMLButtonElement>(GAME_START_BUTTON_ID(this.props.gameId))
    startButton.textContent = `開始待ち`
    startButton.disabled = true
    this.currentButtonState = 'host'
    this.styleButtonGrayOut(startButton)
  }

  private setGameAbortText(): void {
    const startButton = DomManager.getElementById<HTMLButtonElement>(GAME_START_BUTTON_ID(this.props.gameId))
    startButton.disabled = false
    startButton.textContent = '中止'
    this.currentButtonState = 'abort'
    this.styleButtonAbort(startButton)
  }

  private setGameStatusText(): void {
    const gameNameElement = DomManager.getElementById(GAME_NAME_DIV_ID(this.props.gameId))
    gameNameElement.textContent = `🎮 ${this.props.gameName}`
  }

  private gameStartButtonGrayOut(): void {
    const startButton = DomManager.getElementById<HTMLButtonElement>(GAME_START_BUTTON_ID(this.props.gameId))
    startButton.disabled = true
    this.currentButtonState = 'inactive'
    this.styleButtonGrayOut(startButton)
  }

  private setPlayingGameText(): void {
    const startButton = DomManager.getElementById<HTMLButtonElement>(GAME_START_BUTTON_ID(this.props.gameId))
    if (this.gamePolicy.allowMidwayJoin) {
      this.currentButtonState = 'midwayJoin'
      startButton.textContent = `途中参加`
      startButton.disabled = false
      this.styleButtonStart(startButton)
    } else {
      this.currentButtonState = 'playing'
      startButton.textContent = `プレイ中`
      startButton.disabled = true
      this.styleButtonGrayOut(startButton)
    }
  }

  private setupGameStartButton(): void {
    const startButton = DomManager.getElementById<HTMLButtonElement>(GAME_START_BUTTON_ID(this.props.gameId))
    startButton.addEventListener('click', () => {
      if (this.currentButtonState === 'start') {
        this.sendGameHostMessage()
      } else if (this.currentButtonState === 'abort') {
        this.sendGameAbortMessage()
      } else if (this.currentButtonState === 'midwayJoin') {
        this.sendGameMidwayJoinMessage()
      }
    })
  }

  private setupGameDetailButton(): void {
    const detailButton = DomManager.getElementById<HTMLButtonElement>(GAME_DETAIL_BUTTON_ID(this.props.gameId))
    detailButton.addEventListener('click', () => {
      this.store.of('gamePlugin').gameDescriptionDialogManager.showDialog(this.props.gameId, 'viewOnly')
    })
  }

  private sendGameHostMessage(): void {
    const gameHostMessage = new RequestGameHostMessage({
      gameId: this.props.gameId,
      ownerId: this.store.of('playerPlugin').ownPlayerId,
    })
    this.networkPlugin.messageSender.send(gameHostMessage)
  }

  protected sendGameAbortMessage(): void {
    // 中止前に確認ダイアログを表示
    const shouldAbort: boolean = this.store.of('gamePlugin').gameAbortAlertConfirm.showAlert()
    if (shouldAbort) {
      // ユーザーがOKした場合のみ中止メッセージを送信
      const gameAbortMessage = new RequestGameAbortMessage({
        gameId: this.props.gameId,
        playerId: this.store.of('playerPlugin').ownPlayerId,
      })
      this.networkPlugin.messageSender.send(gameAbortMessage)
    }
  }

  private sendGameMidwayJoinMessage(): void {
    const gameMidwayJoinMessage = new RequestGameMidwayJoinMessage({
      gameId: this.props.gameId,
    })
    this.networkPlugin.messageSender.send(gameMidwayJoinMessage)
  }

  private styleButtonGrayOut(button: HTMLButtonElement): void {
    button.disabled = true
    button.style.backgroundColor = 'lightgray'
    button.style.color = 'black'
  }

  private styleButtonAbort(button: HTMLButtonElement): void {
    button.disabled = false
    button.style.backgroundColor = 'white'
    button.style.color = 'red'
    button.style.border = '1px solid red'
  }

  private styleButtonStart(button: HTMLButtonElement): void {
    button.disabled = false
    button.style.backgroundColor = 'var(--c-primary-deep)'
    button.style.color = 'white'
    button.style.border = 'none'
  }
}
