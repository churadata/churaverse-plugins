import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { GameStartEvent } from '../event/gameStartEvent'
import { GameIds } from '../interface/gameIds'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GamePluginStore } from '../store/defGamePluginStore'

/**
 * 全てのゲームプラグインの基本となる抽象クラス
 */
export abstract class BaseGamePlugin extends BasePlugin<IMainScene> {
  protected abstract gameId: GameIds
  private _isActive: boolean = false
  private _gameOwnerId?: string
  private _participantIds: string[] = []
  private _isOwnPlayerMidwayParticipant: boolean = false
  protected gamePluginStore!: GamePluginStore

  protected get isActive(): boolean {
    return this._isActive
  }

  public get gameOwnerId(): string | undefined {
    return this._gameOwnerId
  }

  public get participantIds(): string[] {
    return this._participantIds
  }

  public get isOwnPlayerMidwayParticipant(): boolean {
    return this._isOwnPlayerMidwayParticipant
  }

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.getStores.bind(this))
    this.bus.subscribeEvent('gameStart', this.onGameStart.bind(this), 'HIGH')
    this.bus.subscribeEvent('priorGameData', this.getPriorGameData.bind(this), 'HIGH')
  }

  /**
   * ゲーム開始時に共通して登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.terminateGame)
    this.bus.subscribeEvent('gameEnd', this.terminateGame)
  }

  /**
   * ゲーム中断・終了時に共通して削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.terminateGame)
    this.bus.unsubscribeEvent('gameEnd', this.terminateGame)
  }

  private getStores(): void {
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  private getPriorGameData(ev: PriorGameDataEvent): void {
    this._isActive = this.gameId === ev.runningGameId
    if (!this.isActive) return
    this._isOwnPlayerMidwayParticipant = true
    this.handleMidwayParticipant()
  }

  private onGameStart(ev: GameStartEvent): void {
    this._isActive = this.gameId === ev.gameId
    if (!this.isActive) return
    this._gameOwnerId = ev.playerId
    this._participantIds = this.store.of('playerPlugin').players.getAllId()
    this.subscribeGameEvent()
    this.handleGameStart()
  }

  private readonly terminateGame = (ev: GameAbortEvent | GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    this._isActive = false
    this._gameOwnerId = undefined
    this._participantIds = []
    this._isOwnPlayerMidwayParticipant = false
    this.unsubscribeGameEvent()
    this.handleGameTermination()
  }

  /**
   * ゲーム特有の開始時の処理を実装するための抽象メソッド
   * 各ゲームプラグインでオーバーライドし、具体的な処理を定義する
   */
  protected abstract handleGameStart(): void

  /**
   * ゲームの終了・中断時の処理を実装するための抽象メソッド。
   * 各ゲームプラグインでオーバーライドし、具体的な処理を定義する。
   */
  protected abstract handleGameTermination(): void

  /**
   * ゲーム特有の途中参加時の処理を実装するための抽象メソッド
   * 各ゲームプラグインでオーバーライドし、具体的な処理を定義する
   */
  protected abstract handleMidwayParticipant(): void
}
