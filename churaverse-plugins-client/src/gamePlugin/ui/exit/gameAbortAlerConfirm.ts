import { IGameAbortAlertConfirm } from '../../interface/IGameAbortAlertConfirm'

export class GameAbortAlertConfirm implements IGameAbortAlertConfirm {
  private message: string = 'このゲームを中止して退出しますか？'

  public showAlert(): boolean {
    const shouldExit = window.confirm(this.message)
    return shouldExit
  }

  public setGameAbortMessage(gameName: string): void {
    this.message = gameName + 'を中止して退出しますか？'
  }
}
