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

  private observer: IntersectionObserver | undefined = undefined
  private totalDuration: number = 1
  private lastRemainingSeconds: number | undefined = undefined
  private alertThreshold: number = 3
  private progressBarEl: SVGCircleElement | undefined = undefined
  private progressValueEl: HTMLDivElement | undefined = undefined

  private readonly radius = 45
  private readonly circumference = 2 * Math.PI * this.radius

  private static readonly DEFAULT_TRANSITION = 'stroke-dashoffset 0.25s linear, stroke 0.3s ease'
  private static readonly JUMP_THRESHOLD_SECONDS = 2
  /** IntersectionObserverのrootMargin。画面下部40%に入ったら初期化を開始 */
  private static readonly OBSERVER_ROOT_MARGIN = '0px 0px -40% 0px'

  public constructor(private readonly props: CountDownBarProps) {}

  public initialize(): void {
    this.element = DomManager.addJsxDom(CountDownBarComponent(this.props))
    this.setupObserver()
  }

  public remove(): void {
    if (this.observer !== undefined) {
      this.observer.disconnect()
      this.observer = undefined
    }
    this.element.remove()
  }

  /**
   * サーバ同期型の描画更新。残り秒から比率を計算して stroke-dashoffset を更新する。
   */
  public updateDashOffset(remainingSeconds: number): void {
    this.ensureElementsCached()

    // 残り秒数表示を更新
    if (this.progressValueEl !== undefined) {
      this.progressValueEl.textContent = Math.floor(remainingSeconds).toString()
    }

    this.updateProgressBar(remainingSeconds)
    this.lastRemainingSeconds = remainingSeconds
  }

  private setupObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.initializeFromDataset()
            observer.disconnect()
          }
        }
      },
      {
        root: null,
        rootMargin: CountDownBar.OBSERVER_ROOT_MARGIN,
        threshold: 0
      }
    )

    observer.observe(this.element)
    this.observer = observer
  }

  private initializeFromDataset(): void {
    const remainingSecondsStr = this.element.dataset.remainingSeconds
    if (remainingSecondsStr === undefined) return

    const remainingSeconds = this.parseNumeric(remainingSecondsStr, 0)
    this.totalDuration = this.parseNumeric(this.element.dataset.duration, 1, true)
    this.alertThreshold = this.parseNumeric(this.element.dataset.alertThresholdSeconds, 3)

    this.ensureElementsCached()
    this.initializeProgress(remainingSeconds)
    this.updateAlertState(remainingSeconds)
    this.lastRemainingSeconds = remainingSeconds
  }

  /**
   * 数値パース
   */
  private parseNumeric(value: string | undefined, defaultValue: number, positiveOnly = false): number {
    if (value === undefined) return defaultValue
    const parsed = parseFloat(value)
    if (!Number.isFinite(parsed)) return defaultValue
    if (positiveOnly && parsed <= 0) return defaultValue
    return parsed
  }

  /**
   * キャッシュされていなければ取得する
   */
  private ensureElementsCached(): void {
    if (this.progressValueEl === undefined) {
      this.progressValueEl = this.element.querySelector<HTMLDivElement>(`.${styles.progressValue}`) ?? undefined
    }
    if (this.progressBarEl === undefined) {
      this.progressBarEl = this.element.querySelector<SVGCircleElement>(`.${styles.progressBar}`) ?? undefined
    }
  }

  /**
   * プログレスバーと秒数表示の初期化
   */
  private initializeProgress(remainingSeconds: number): void {
    if (this.progressValueEl !== undefined) {
      this.progressValueEl.textContent = Math.floor(remainingSeconds).toString()
    }

    if (this.progressBarEl !== undefined) {
      this.progressBarEl.style.transition = 'none'
      const offset = this.calculateStrokeDashoffset(remainingSeconds)
      this.progressBarEl.style.strokeDashoffset = `${offset}`
      this.progressBarEl.getBoundingClientRect()
      this.progressBarEl.style.transition = CountDownBar.DEFAULT_TRANSITION
    }
  }

  /**
   * プログレスバーの描画を更新する
   */
  private updateProgressBar(remainingSeconds: number): void {
    if (this.progressBarEl === undefined) return

    this.updateAlertState(remainingSeconds)
    const newOffset = this.calculateStrokeDashoffset(remainingSeconds)

    // 大きなジャンプがあった場合はトランジションなしで即座に更新
    const prev = this.lastRemainingSeconds ?? remainingSeconds
    const isLargeJump = Math.abs(remainingSeconds - prev) > CountDownBar.JUMP_THRESHOLD_SECONDS

    if (isLargeJump) {
      const prevTransition = this.progressBarEl.style.transition
      this.progressBarEl.style.transition = 'none'
      this.progressBarEl.style.strokeDashoffset = `${newOffset}`
      this.progressBarEl.getBoundingClientRect()

      requestAnimationFrame(() => {
        if (this.progressBarEl === undefined) return
        this.progressBarEl.style.transition = prevTransition !== '' ? prevTransition : CountDownBar.DEFAULT_TRANSITION
      })
    } else {
      if (this.progressBarEl.style.transition === '') {
        this.progressBarEl.style.transition = CountDownBar.DEFAULT_TRANSITION
      }
      this.progressBarEl.style.strokeDashoffset = `${newOffset}`
    }
  }

  /**
   * カウントダウンバーのオフセットを計算する
   */
  private calculateStrokeDashoffset(remainingSeconds: number): number {
    const total = this.totalDuration > 0 ? this.totalDuration : 1
    const ratio = Math.max(0, Math.min(1, remainingSeconds / total))
    return this.circumference * (1 - ratio)
  }

  /**
   * 警告状態の切り替え
   */
  private updateAlertState(remainingSeconds: number): void {
    if (this.progressBarEl === undefined) return

    if (remainingSeconds <= this.alertThreshold) {
      this.progressBarEl.classList.add(styles.alert)
    } else {
      this.progressBarEl.classList.remove(styles.alert)
    }
  }
}