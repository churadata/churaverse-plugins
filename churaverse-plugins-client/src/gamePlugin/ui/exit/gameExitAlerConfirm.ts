import { IGameExitAlertConfirm } from '../../interface/IGameExitAlertConfirm'

export class GameExitAlertConfirm implements IGameExitAlertConfirm {
  private message: string = 'このゲームを中止して退出しますか？'

  public showAlert(): boolean {
    // フォールバック: window.confirm を直接使用
    // eslint-disable-next-line no-alert
    const shouldExit = window.confirm(this.message)
    return shouldExit
  }

  public setMessage(message: string): void {
    this.message = message
  }
}
