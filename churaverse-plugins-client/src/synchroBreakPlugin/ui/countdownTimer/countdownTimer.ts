import { SynchroBreakPluginStore } from '../../store/defSynchroBreakPluginStore'
import { ICountdownTimer } from '../../interface/ICountdownTimer'

export const COUNTDOWN_TIMER_ID = 'countdown-timer'

export class CountdownTimer implements ICountdownTimer {
  private countdown: number = 0
  private initialCountdown: number = 0
  private nyokkiStatus: boolean | undefined = undefined
  private nyokkiLogText!: string

  public constructor(private readonly synchroBreakPluginStore: SynchroBreakPluginStore) {
    // gameUiにカウントダウンを追加
    this.synchroBreakPluginStore.uiManager.addUi('countdownTimer', this)
  }

  public startCountdown(): void {
    this.initialCountdownUi() // 初回の表示を行う
    const intervalId = setInterval(() => {
      this.countdown--
      if (this.countdown <= 0) {
        clearInterval(intervalId)
        this.nyokkiStatus = undefined
        this.close()
      } else {
        this.updateCountdownUi()
      }
    }, 1000)
  }

  private initialCountdownUi(): void {
    this.synchroBreakPluginStore.descriptionWindow.setDescriptionText(
      `ニョッキゲーム開始!!!<br>残り${this.countdown}秒以内にボタンを押してください!!`
    )
  }

  private updateCountdownUi(): void {
    const nyokkiProgressText = '現在ニョキゲームが進行中'
    if (this.nyokkiStatus === undefined) {
      this.synchroBreakPluginStore.descriptionWindow.setDescriptionText(
        `${nyokkiProgressText}<br>残り${this.countdown}秒以内にボタンを押してください!!`
      )
    } else {
      if (this.nyokkiStatus) {
        this.synchroBreakPluginStore.descriptionWindow.setDescriptionText(
          `${nyokkiProgressText}<br>${this.nyokkiLogText}<br>残り${this.countdown}秒です。少々お待ちください`
        )
      } else {
        this.synchroBreakPluginStore.descriptionWindow.setDescriptionText(
          `${nyokkiProgressText}<br>${this.nyokkiLogText}<br>残り${this.countdown}秒です。少々お待ちください`
        )
      }
    }
  }

  public setTimeLimit(time: number): void {
    this.countdown = time
    this.initialCountdown = time
  }

  public getNyokkiStatus(status: boolean, nyokkiLogText: string): void {
    this.nyokkiStatus = status
    this.nyokkiLogText = nyokkiLogText
    if (this.countdown > 0) this.updateCountdownUi()
  }

  public open(): void {
    this.countdown = this.initialCountdown
    this.startCountdown()
  }

  public close(): void {}

  public remove(): void {}
}

declare module '../uiManager' {
  export interface GameUiMap {
    countdownTimer: CountdownTimer
  }
}
