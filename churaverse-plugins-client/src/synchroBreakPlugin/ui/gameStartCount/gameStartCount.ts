import { SynchroBreakPluginStore } from '../../store/defSynchroBreakPluginStore'
import { IGameUi } from '../../interface/IGameUi'

export const GAME_START_COUNT_ID = 'game-start-count'

export class GameStartCount implements IGameUi {
  private countdown: number = 3

  public constructor(private readonly synchroBreakPluginStore: SynchroBreakPluginStore) {
    // uiManagerにgameStartCountを追加
    this.synchroBreakPluginStore.uiManager.addUi('startCountDown', this)
  }

  private startCountdown(): void {
    this.updateCountdownUI()
    const intervalId = setInterval(() => {
      this.countdown--
      if (this.countdown < -1) {
        clearInterval(intervalId)
      } else {
        this.updateCountdownUI()
      }
    }, 1000)
  }

  private updateCountdownUI(): void {
    if (this.countdown <= 0) {
      this.close()
    } else {
      this.synchroBreakPluginStore.descriptionWindow.setDescriptionText(`開始まで<br>${this.countdown}秒`)
    }
  }

  public open(): void {
    this.countdown = 3
    this.startCountdown()
  }

  public close(): void {}

  public remove(): void {}
}
