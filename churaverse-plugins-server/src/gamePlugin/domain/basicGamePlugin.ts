import { BasePlugin, IMainScene } from 'churaverse-engine-server'

/**
 * 複数のプラグインからゲームが成り立っている場合の基礎抽象クラス
 */
export abstract class BasicGamePlugin extends BasePlugin<IMainScene> {
  public listenEvent(): void {
    this.bus.subscribeEvent('gameStart', this.handleGameStart.bind(this))
  }

  /**
   * ゲーム開始時に共通して登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    this.bus.subscribeEvent('gameEnd', this.handleGameTermination)
    this.bus.subscribeEvent('gameAbort', this.handleGameTermination)
  }

  /**
   * ゲーム中断・終了時に共通して削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    this.bus.unsubscribeEvent('gameEnd', this.handleGameTermination)
    this.bus.unsubscribeEvent('gameAbort', this.handleGameTermination)
  }

  /**
   * ゲーム特有の開始時の処理を実装するための抽象メソッド
   * 各ゲームプラグインでオーバーライドし、具体的な処理を定義する
   */
  protected abstract handleGameStart(): void

  /**
   * ゲームの終了・中断時の処理を実装するための抽象メソッド。
   * 各ゲームプラグインでオーバーライドし、具体的な処理を定義する。
   *
   * - `gameEnd` および `gameAbort` イベントのコールバックとして登録される。
   * - `unsubscribe` で正しく解除できるよう、アロー関数で実装する。
   */
  protected abstract handleGameTermination: () => void
}
