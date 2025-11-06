import { EntityDespawnEvent, IMainScene } from 'churaverse-engine-client'
import { isPlayer } from '@churaverse/player-plugin-client/domain/player'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameStartEvent } from '../event/gameStartEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { GameIds } from '../interface/gameIds'
import { IGameInfo } from '../interface/IGameInfo'
import { GamePluginStore } from '../store/defGamePluginStore'
import { BaseGamePlugin } from './baseGamePlugin'
import { GamePlayerQuitEvent } from '../event/gamePlayerQuitEvent'
import { GamePlayerQuitMessage } from '../message/gamePlayerQuitMessage'
import { IGameSelectionListItemRenderer } from '../interface/IGameSelectionListItemRenderer'
import { GameHostEvent } from '../event/gameHostEvent'
import { GameState } from '../type/gameState'
import { GamePolicy } from '../interface/gamePolicy'
import { GameMidwayJoinEvent } from '../event/gameMidwayJoinEvent'
import { SubmitGameJoinEvent } from '../event/submitGameJoinEvent'
import { SubmitGameJoinMessage } from '../message/submitGameJoinMessage'

/**
 * BaseGamePluginを拡張したCoreなゲーム抽象クラス
 */
export abstract class CoreGamePlugin extends BaseGamePlugin implements IGameInfo {
  public abstract gameId: GameIds
  protected abstract gameEntryRenderer: IGameSelectionListItemRenderer
  protected abstract gameName: string
  public abstract gamePolicy: GamePolicy
  private _isActive: boolean = false
  private _gameOwnerId?: string
  private _joinedPlayerIds: string[] = []
  private _isJoined: boolean = false
  private _gameState: GameState = 'inactive'
  protected gamePluginStore!: GamePluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>

  public get isActive(): boolean {
    return this._isActive
  }

  public get gameOwnerId(): string | undefined {
    return this._gameOwnerId
  }

  public get joinedPlayerIds(): string[] {
    return this._joinedPlayerIds
  }

  public get isJoined(): boolean {
    return this._isJoined
  }

  public get gameState(): GameState {
    return this._gameState
  }

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('priorGameData', this.priorGameData.bind(this), 'HIGH')
    this.bus.subscribeEvent('gameHost', this.gameHost.bind(this))
    this.bus.subscribeEvent('submitGameJoin', this.submitGameJoin.bind(this))
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this), 'HIGH')
    this.bus.subscribeEvent('gameAbort', this.gameAbort.bind(this))
    this.bus.subscribeEvent('gameEnd', this.gameEnd.bind(this))
    this.bus.subscribeEvent('gameMidwayJoin', this.gameMidwayJoin.bind(this))
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('entityDespawn', this.onPlayerLeave)
    this.bus.subscribeEvent('gamePlayerQuit', this.onPlayerQuitGame)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('entityDespawn', this.onPlayerLeave)
    this.bus.unsubscribeEvent('gamePlayerQuit', this.onPlayerQuitGame)
  }

  private init(): void {
    this.gamePluginStore = this.store.of('gamePlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  private priorGameData(ev: PriorGameDataEvent): void {
    this._isActive = this.gameId === ev.runningGameId
    this.gameEntryRenderer.onPriorGameData(ev.runningGameId, ev.gameState)
    if (!this.isActive) return
    this._gameState = ev.gameState
    this._gameOwnerId = ev.ownerId
    this.gamePluginStore.gameLogRenderer.gameLog(`${this.gameName}が開始されています。`, 400)
    this.gameInfoStore.games.set(this.gameId, this)
  }

  private gameHost(ev: GameHostEvent): void {
    this._isActive = this.gameId === ev.gameId
    this.gameEntryRenderer.onGameHost(ev.gameId)
    if (!this.isActive) return
    this._gameState = 'host'
    this._gameOwnerId = ev.ownerId
    this.gameInfoStore.games.set(this.gameId, this)
    this.gamePluginStore.countdownTimer.start(ev.timeoutSec)
    if (ev.ownerId === this.store.of('playerPlugin').ownPlayerId) {
      this.gamePluginStore.gameDescriptionDialogManager.showDialog(this.gameId, 'viewOnly')
      this.bus.post(new SubmitGameJoinEvent(this.gameId, true))
    } else {
      this.gamePluginStore.gameDescriptionDialogManager.showDialog(this.gameId, 'joinable')
    }
  }

  private submitGameJoin(ev: SubmitGameJoinEvent): void {
    if (ev.gameId !== this.gameId) return
    this._isJoined = ev.willJoin

    if (this.isJoined) {
      this.gamePluginStore.gameUiManager.initializeAllUis(this.gameId)
    } else {
      this.gamePluginStore.countdownTimer.close()
    }

    const submitGameJoinMessage = new SubmitGameJoinMessage({
      gameId: this.gameId,
      willJoin: this.isJoined,
    })
    this.networkPluginStore.messageSender.send(submitGameJoinMessage)
  }

  protected gameStart(ev: GameStartEvent): void {
    this.gameEntryRenderer.onGameStart(ev.gameId, this.isJoined)
    if (!this.isActive) return
    this._gameState = 'start'
    this._gameOwnerId = ev.playerId
    this._joinedPlayerIds = ev.joinedPlayerIds
    this.gamePluginStore.countdownTimer.close()
    this.gamePluginStore.gameDescriptionDialogManager.closeDialog()
    this.gamePluginStore.gameLogRenderer.gameStartLog(this.gameName, this.gameOwnerId ?? '')
  }

  private gameAbort(ev: GameAbortEvent): void {
    this.gameEntryRenderer.resetStartButton()
    if (ev.gameId !== this.gameId) return
    this.gamePluginStore.gameLogRenderer.gameAbortLog(this.gameName, ev.playerId)
    this.terminateGame()
  }

  private gameEnd(ev: GameEndEvent): void {
    this.gameEntryRenderer.resetStartButton()
    if (ev.gameId !== this.gameId) return
    this.gamePluginStore.gameLogRenderer.gameEndLog(this.gameName)
    this.terminateGame()
  }

  private terminateGame(): void {
    this._isActive = false
    this._gameOwnerId = undefined
    this._joinedPlayerIds = []
    this.gameInfoStore.games.delete(this.gameId)
    this._gameState = 'inactive'

    if (this.isJoined) {
      this.gamePluginStore.gameUiManager.removeAllUis(this.gameId)
      this._isJoined = false
    }
  }

  private readonly onPlayerLeave = (ev: EntityDespawnEvent): void => {
    if (!isPlayer(ev.entity)) return
    const playerId: string = ev.entity.id
    if (!this.removeJoinedPlayer(playerId)) return
    this.handlePlayerLeave(playerId)
  }

  /**
   * プレイヤーがちゅらバースから退出した時の処理
   * @param playerId 退出したプレイヤーのID
   */
  protected abstract handlePlayerLeave(playerId: string): void

  private readonly onPlayerQuitGame = (ev: GamePlayerQuitEvent): void => {
    if (!this.removeJoinedPlayer(ev.playerId)) return
    const gamePlayerQuitMessage = new GamePlayerQuitMessage({ gameId: ev.gameId, playerId: ev.playerId })
    this.networkPluginStore.messageSender.send(gamePlayerQuitMessage)
    this.handlePlayerQuitGame(ev.playerId)
  }

  /**
   * プレイヤーが参加中のゲームから離脱した時の処理
   * @param playerId ゲームから離脱したプレイヤーのID
   */
  protected abstract handlePlayerQuitGame(playerId: string): void

  private gameMidwayJoin(ev: GameMidwayJoinEvent): void {
    if (!this.isActive || !ev.joinedPlayerIds.includes(this.store.of('playerPlugin').ownPlayerId)) return
    this.gamePluginStore.gameLogRenderer.gameMidwayJoinLog(this.gameName, ev.joinPlayerId)
    this._joinedPlayerIds = ev.joinedPlayerIds
    if (ev.joinPlayerId === this.store.of('playerPlugin').ownPlayerId) {
      this.gameEntryRenderer.onGameStart(this.gameId, true)
    }
  }

  /**
   * 退出したプレイヤーがゲーム参加者の場合、参加者リストから削除しtrueを返す
   */
  private removeJoinedPlayer(playerId: string): boolean {
    const idx = this._joinedPlayerIds.indexOf(playerId)
    if (idx === -1) return false
    this._joinedPlayerIds.splice(idx, 1)
    return true
  }
}
