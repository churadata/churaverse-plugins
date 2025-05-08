import { BasePlugin, IMainScene } from 'churaverse-engine-server'
import { GameIds } from '../interface/gameIds'
import { GameStartEvent } from '../event/gameStartEvent'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GamePluginStore } from '../store/defGamePluginStore'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'

/**
 * 全てのゲームプラグインの基本となる抽象クラス
 */
export abstract class BaseGamePlugin extends BasePlugin<IMainScene> {
  public abstract gameId: GameIds
  protected gamePluginStore!: GamePluginStore

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.getStores.bind(this))
    this.bus.subscribeEvent('gameStart', this.onGameStart.bind(this))
    this.bus.subscribeEvent('priorGameData', this.getPriorGameData.bind(this))
  }

  /**
   * ゲーム開始時に共通して登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    this.bus.subscribeEvent('gameEnd', this.onGameTerminate)
    this.bus.subscribeEvent('gameAbort', this.onGameTerminate)
  }

  /**
   * ゲーム中断・終了時に共通して削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    this.bus.unsubscribeEvent('gameEnd', this.onGameTerminate)
    this.bus.unsubscribeEvent('gameAbort', this.onGameTerminate)
  }

  private getStores(): void {
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  protected getIsActive(): boolean {
    return this.gamePluginStore.games.get(this.gameId)?.isActive ?? false
  }

  private getPriorGameData(ev: PriorGameDataEvent): void {
    if (!this.getIsActive()) return
    this.subscribeGameEvent()
  }

  private onGameStart(ev: GameStartEvent): void {
    if (!this.getIsActive()) return
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
}
