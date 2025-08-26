import { IGameExitAlertConfirm } from '../../interface/IGameExitAlertConfirm'

/**
 * window.confirm を使用した標準的な退出確認ダイアログ
 */
export class ExitAlert implements IGameExitAlertConfirm {
  public show(message?: string): boolean {
    try {
      // eslint-disable-next-line no-alert
      return window.confirm(message ?? 'このゲームを中止して退出しますか？')
    } catch {
      return false
    }
  }

  public close(): void {
    // window.confirm は自動的に閉じるため、特に何もしない
  }
}
