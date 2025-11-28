import { DomManager } from 'churaverse-engine-client'
import { CountDownBarComponent, CountDownBarProps } from './component/CountDownBarComponent'
import styles from './component/CountDownBarComponent.module.scss'
import { ICountDownBar } from '../../interface/ICountDownBar'

/**
 * 円形カウントダウンバー
 * - 中央に残り秒数を表示（percent をそのまま数値表示）
 */
export class CountDownBar implements ICountDownBar {
  public element!: HTMLElement
  public readonly visible: boolean = false
  private observer: IntersectionObserver | null = null
  private totalDuration: number = 1
  private lastRemainingSeconds: number | null = null
  private readonly radius = 45
  private readonly circumference = 2 * Math.PI * this.radius
  private progressBarEl: SVGCircleElement | null = null
  private progressValueEl: HTMLDivElement | null = null
  private alertThreshold: number = 3
  private static readonly DEFAULT_TRANSITION = 'stroke-dashoffset 0.25s linear, stroke 0.3s ease'
  private static readonly JUMP_THRESHOLD_SECONDS = 2

  public constructor(private readonly props: CountDownBarProps) {}

  public initialize(): void {
    this.element = DomManager.addJsxDom(CountDownBarComponent(this.props))
    this.setupObserver()
  }

  private setupObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const remainingSecondsStr = this.element.dataset.remainingSeconds
          const durationStr = this.element.dataset.duration
          const alertThresholdStr = this.element.dataset.alertThresholdSeconds

          if (remainingSecondsStr !== undefined) {
            const remainingSecondsRaw = parseFloat(remainingSecondsStr)
            const remainingSeconds = Number.isFinite(remainingSecondsRaw) ? remainingSecondsRaw : 0
            const durationRaw = durationStr !== undefined ? parseFloat(durationStr) : NaN
            const duration = Number.isFinite(durationRaw) ? durationRaw : 1 // 秒
            this.totalDuration = duration > 0 ? duration : 1
            const alertThresholdRaw = alertThresholdStr !== undefined ? parseFloat(alertThresholdStr) : NaN
            this.alertThreshold = Number.isFinite(alertThresholdRaw) ? alertThresholdRaw : 3

            // 要素参照をキャッシュ
            this.progressBarEl = this.element.querySelector<SVGCircleElement>(`.${styles.progressBar}`)
            this.progressValueEl = this.element.querySelector<HTMLDivElement>(`.${styles.progressValue}`)

            if (this.progressBarEl !== null) {
              this.progressBarEl.style.transition = 'none'
              const offset = this.calculateStrokeDashoffset(remainingSeconds)
              this.progressBarEl.style.strokeDashoffset = `${offset}`
              this.progressBarEl.getBoundingClientRect()
              this.progressBarEl.style.transition = CountDownBar.DEFAULT_TRANSITION
            }

            if (this.progressValueEl !== null) {
              this.progressValueEl.textContent = Math.floor(remainingSeconds).toString()
            }

            if (this.progressBarEl !== null) {
              if (remainingSeconds <= this.alertThreshold) this.progressBarEl.classList.add(styles.alert)
              else this.progressBarEl.classList.remove(styles.alert)
            }

            this.lastRemainingSeconds = remainingSeconds
          }

          observer.disconnect()
        }
      },
      { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0 }
    )

    observer.observe(this.element)
    this.observer = observer
  }

  public remove(): void {
    if (this.observer !== null) {
      this.observer.disconnect()
      this.observer = null
    }
    this.element.remove()
  }

  /**
   * サーバ同期型の描画更新。残り秒から比率を計算して stroke-dashoffset を更新する。
   */
  public updateDashOffset(remainingSeconds: number): void {
    this.ensureElementsCached()
    this.updateProgressValue(remainingSeconds)
    this.updateProgressBar(remainingSeconds)
    this.lastRemainingSeconds = remainingSeconds
  }

  /**
   * 要素参照がキャッシュされていなければ取得する
   */
  private ensureElementsCached(): void {
    if (this.progressValueEl === null) {
      this.progressValueEl = this.element.querySelector<HTMLDivElement>(`.${styles.progressValue}`)
    }
    if (this.progressBarEl === null) {
      this.progressBarEl = this.element.querySelector<SVGCircleElement>(`.${styles.progressBar}`)
    }
  }

  /**
   * 残り秒数の表示を更新する
   */
  private updateProgressValue(remainingSeconds: number): void {
    if (this.progressValueEl === null) return
    this.progressValueEl.textContent = Math.floor(remainingSeconds).toString()
  }

  /**
   * プログレスバーの描画を更新する
   */
  private updateProgressBar(remainingSeconds: number): void {
    if (this.progressBarEl === null) return

    this.updateAlertState(remainingSeconds)

    const newOffset = this.calculateStrokeDashoffset(remainingSeconds)
    const prev = this.lastRemainingSeconds ?? remainingSeconds
    const isJump = Math.abs(remainingSeconds - prev) > CountDownBar.JUMP_THRESHOLD_SECONDS

    if (isJump) {
      this.applyJumpTransition(newOffset)
    } else {
      this.applySmoothTransition(newOffset)
    }
  }

  /**
   * 警告状態の切り替え
   */
  private updateAlertState(remainingSeconds: number): void {
    if (this.progressBarEl === null) return

    if (remainingSeconds <= this.alertThreshold) {
      this.progressBarEl.classList.add(styles.alert)
    } else {
      this.progressBarEl.classList.remove(styles.alert)
    }
  }

  /**
   * 大きなジャンプ時のトランジション（アニメーションなしで即座に移動）
   */
  private applyJumpTransition(newOffset: number): void {
    if (this.progressBarEl === null) return

    const prevTransition = this.progressBarEl.style.transition
    this.progressBarEl.style.transition = 'none'
    this.progressBarEl.style.strokeDashoffset = `${newOffset}`
    this.progressBarEl.getBoundingClientRect()

    requestAnimationFrame(() => {
      if (this.progressBarEl === null) return
      this.progressBarEl.style.transition = prevTransition !== '' ? prevTransition : CountDownBar.DEFAULT_TRANSITION
    })
  }

  /**
   * 通常時のスムーズなトランジション
   */
  private applySmoothTransition(newOffset: number): void {
    if (this.progressBarEl === null) return

    if (this.progressBarEl.style.transition === '') {
      this.progressBarEl.style.transition = CountDownBar.DEFAULT_TRANSITION
    }
    this.progressBarEl.style.strokeDashoffset = `${newOffset}`
  }

  /**
   * - 円形カウントダウンバーの stroke-dashoffset を計算する
   */
  private calculateStrokeDashoffset(remainingSeconds: number): number {
    const total = this.totalDuration > 0 ? this.totalDuration : 1
    const ratio = Math.max(0, Math.min(1, remainingSeconds / total))
    return this.circumference * (1 - ratio)
  }
}
