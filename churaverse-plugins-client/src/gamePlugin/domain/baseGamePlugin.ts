import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { GameStartEvent } from '../event/gameStartEvent'
import { GameIds } from '../interface/gameIds'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameInfoStore } from '../store/defGamePluginStore'
import { ParticipationResponseEvent } from '../event/participationResponseEvent'

/**
 * 全てのゲームプラグインの基本となる抽象クラス
 */
export abstract class BaseGamePlugin extends BasePlugin<IMainScene> {
  public abstract gameId: GameIds
  protected gameInfoStore!: GameInfoStore

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.getStores.bind(this))
    this.bus.subscribeEvent('participationResponse', this.onParticipationResponse.bind(this))
    this.bus.subscribeEvent('gameStart', this.onGameStart.bind(this))
    this.bus.subscribeEvent('priorGameData', this.getPriorGameData.bind(this))
  }

  public getStores(): void {
    this.gameInfoStore = this.store.of('gameInfo')
  }

  /**
   * ゲーム開始時に共通して登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.onGameTerminate)
    this.bus.subscribeEvent('gameEnd', this.onGameTerminate)
  }

  /**
   * ゲーム中断・終了時に共通して削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.onGameTerminate)
    this.bus.unsubscribeEvent('gameEnd', this.onGameTerminate)
  }

  protected get isActive(): boolean {
    return this.gameInfoStore.games.get(this.gameId)?.isActive ?? false
  }

  private getPriorGameData(ev: PriorGameDataEvent): void {
    if (!this.isActive) return
    // 途中参加者はonGameStartではなく、getPriorGameDataでsubscribeGameEventする
    this.subscribeGameEvent()
    this.handleMidwayParticipant()
  }

  private onParticipationResponse(ev: ParticipationResponseEvent): void {
    if (!this.isActive || !ev.isJoin) return
    this.subscribeGameEvent()
  }

  private onGameStart(ev: GameStartEvent): void {
    if (!this.isActive) return
    this.subscribeGameEvent()
    this.handleGameStart()
  }

  private readonly onGameTerminate = (ev: GameAbortEvent | GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
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
