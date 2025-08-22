import { GameIds } from './interface/gameIds'
import { IGameExitAlertConfirm } from './interface/IGameExitAlertConfirm'
import { IGameExitAlertConfirmManager } from './interface/IGameExitAlertConfirmManager'

export class GameExitAlertConfirmManager implements IGameExitAlertConfirmManager {
  private readonly gameExitAlerts = new Map<GameIds, IGameExitAlertConfirm>()

  public add(name: GameIds, alert: IGameExitAlertConfirm): void {
    this.gameExitAlerts.set(name, alert)
  }

  public showAlert(gameId: GameIds, message?: string): boolean {
    const alert = this.gameExitAlerts.get(gameId)
    if (alert === undefined) {
      // フォールバック: window.confirm を直接使用
      try {
        // eslint-disable-next-line no-alert
        return window.confirm(message ?? 'このゲームを中止して退出しますか？')
      } catch {
        return false
      }
    }

    try {
      return alert.show(message)
    } catch {
      return false
    }
  }

  public closeAlert(): void {
    // すべての登録済みアラートに対し close を呼ぶ（confirm 実装は副作用なし）
    for (const a of this.gameExitAlerts.values()) {
      try {
        a.close()
      } catch {
        // ignore
      }
    }
  }
}
