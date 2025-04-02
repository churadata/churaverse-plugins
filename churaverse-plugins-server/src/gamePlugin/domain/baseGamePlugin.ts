import { BasePlugin, IMainScene } from 'churaverse-engine-server'
import { IGameInfo } from '../interface/IGameInfo'
import { GameIds } from '../interface/gameIds'
import { GamePluginStore } from '../store/defGamePluginStore'
import { GameStartEvent } from '../event/gameStartEvent'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'

/**
 * 全てのゲームプラグインの基本となる抽象クラス
 */
export abstract class BaseGamePlugin extends BasePlugin<IMainScene> implements IGameInfo {
  public abstract gameId: GameIds
  private _isActive: boolean = false
  private _gameOwnerId?: string
  private _participantIds: string[] = []
  protected gamePluginStore!: GamePluginStore

  public get isActive(): boolean {
    return this._isActive
  }

  public get gameOwnerId(): string | undefined {
    return this._gameOwnerId
  }

  public get participantIds(): string[] {
    return this._participantIds
  }

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.getStores.bind(this))
    this.bus.subscribeEvent('gameStart', this.onGameStart.bind(this), 'HIGH')
  }

  /**
   * ゲーム開始時に共通して登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    this.bus.subscribeEvent('gameEnd', this.terminateGame, 'HIGH')
    this.bus.subscribeEvent('gameAbort', this.terminateGame, 'HIGH')
  }

  /**
   * ゲーム中断・終了時に共通して削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    this.bus.unsubscribeEvent('gameEnd', this.terminateGame)
    this.bus.unsubscribeEvent('gameAbort', this.terminateGame)
  }

  private getStores(): void {
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  private onGameStart(ev: GameStartEvent): void {
    this._isActive = this.gameId === ev.gameId
    if (!this.isActive) return
    this._gameOwnerId = ev.playerId
    this._participantIds = this.store.of('playerPlugin').players.getAllId()
    this.subscribeGameEvent()
    this.gamePluginStore.games.set(this.gameId, this)
    this.handleGameStart()
  }

  private readonly terminateGame = (ev: GameAbortEvent | GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    this._isActive = false
    this._gameOwnerId = undefined
    this._participantIds = []
    this.gamePluginStore.games.delete(this.gameId)
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
}
