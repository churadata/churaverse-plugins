import { IGameAbortAlertConfirm } from '../../interface/IGameAbortAlertConfirm'

export class GameAbortAlertConfirm implements IGameAbortAlertConfirm {
  private message: string = 'このゲームを中止して退出しますか？'

  public showAlert(): boolean {
    const shouldExit = window.confirm(this.message)
    return shouldExit
  }

  public setMessage(message: string): void {
    this.message = message
  }
}
