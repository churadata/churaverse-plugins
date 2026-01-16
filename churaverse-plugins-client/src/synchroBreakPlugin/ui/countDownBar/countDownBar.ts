import { DomManager } from 'churaverse-engine-client'
import { CountdownBarComponent } from './component/CountdownBarComponent'
import styles from './component/CountdownBarComponent.module.scss'
import { ICountdownBar } from '../../interface/ICountdownBar'

/**
 * 円形カウントダウンバー
 * - 中央に残り秒数を表示（percent をそのまま数値表示）
 */
export class CountdownBar implements ICountdownBar {
  public element!: HTMLElement
  public readonly visible: boolean = false

  private observer?: IntersectionObserver
  private totalDuration: number = 1
  private lastRemainingSeconds?: number
  private readonly alertThreshold: number = 3
  private progressBarEl?: SVGCircleElement
  private progressValueEl?: HTMLDivElement

  private readonly radius = 45
  private readonly circumference = this.radius * 2 * Math.PI

  private static readonly DEFAULT_TRANSITION = 'stroke-dashoffset 1s linear, stroke 0.3s ease'
  private static readonly JUMP_THRESHOLD_SECONDS = 2
  /** IntersectionObserverのrootMargin。画面下部40%に入ったら初期化を開始 */
  private static readonly OBSERVER_ROOT_MARGIN = '0px 0px -40% 0px'

  public initialize(): void {
    if (this.element !== undefined) {
      this.element.remove()
      if (this.observer !== undefined) {
        this.observer.disconnect()
        this.observer = undefined
      }
      this.progressBarEl = undefined
      this.progressValueEl = undefined
    }

    this.element = DomManager.addJsxDom(CountdownBarComponent())
    this.element.style.display = 'none'
    this.setupObserver()
    this.ensureElementsCached()
    if (this.progressBarEl !== undefined) {
      this.progressBarEl.style.strokeDasharray = `${this.circumference}`
      this.progressBarEl.style.strokeDashoffset = `${this.circumference}`
    }
  }

  /**
   * 全体の時間を設定する
   */
  public setTotalDuration(duration: number): void {
    this.totalDuration = Math.max(duration, 1)
  }

  /**
   * サーバ同期型の描画更新。残り秒から比率を計算して stroke-dashoffset を更新する。
   */
  public updateDashOffset(remainingSeconds: number): void {
    this.ensureElementsCached()

    // 残り秒数表示を更新
    if (this.progressValueEl !== undefined) {
      const newText = Math.floor(remainingSeconds).toString()
      this.progressValueEl.textContent = newText
    }

    if (this.lastRemainingSeconds === undefined) {
      this.initializeProgress(remainingSeconds)
      this.lastRemainingSeconds = remainingSeconds
      this.updateProgressBar(remainingSeconds)
    } else {
      this.updateProgressBar(remainingSeconds)
      this.lastRemainingSeconds = remainingSeconds
    }
  }

  private setupObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.ensureElementsCached()
            observer.disconnect()
          }
        }
      },
      {
        root: null,
        rootMargin: CountdownBar.OBSERVER_ROOT_MARGIN,
        threshold: 0
      }
    )

    observer.observe(this.element)
    this.observer = observer
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
      this.progressBarEl.style.transition = CountdownBar.DEFAULT_TRANSITION
    }

    this.updateAlertState(remainingSeconds)
  }

  /**
   * プログレスバーの描画を更新する
   * 現在の秒数から次の秒へ1秒かけてトランジション
   */
  private updateProgressBar(remainingSeconds: number): void {
    if (this.progressBarEl === undefined) return

    this.updateAlertState(remainingSeconds)

    // 大きなジャンプがあった場合はトランジションなしで即座に更新
    const prev = this.lastRemainingSeconds ?? remainingSeconds
    const isLargeJump = Math.abs(remainingSeconds - prev) > CountdownBar.JUMP_THRESHOLD_SECONDS

    if (isLargeJump) {
      const prevTransition = this.progressBarEl.style.transition
      this.progressBarEl.style.transition = 'none'
      const currentOffset = this.calculateStrokeDashoffset(remainingSeconds)
      this.progressBarEl.style.strokeDashoffset = `${currentOffset}`
      this.progressBarEl.getBoundingClientRect()

      requestAnimationFrame(() => {
        if (this.progressBarEl === undefined) return
        this.progressBarEl.style.transition = prevTransition !== '' ? prevTransition : CountdownBar.DEFAULT_TRANSITION
      })
    } else {
      // 現在の秒数から次の秒へトランジション
      if (this.progressBarEl.style.transition === '') {
        this.progressBarEl.style.transition = CountdownBar.DEFAULT_TRANSITION
      }
      const nextOffset = this.calculateStrokeDashoffset(remainingSeconds - 1)
      this.progressBarEl.style.strokeDashoffset = `${nextOffset}`
    }
  }

  /**
   * カウントダウンバーのオフセットを計算する
   */
  private calculateStrokeDashoffset(remainingSeconds: number): number {
    const total = this.totalDuration > 0 ? this.totalDuration : 1
    const ratio = Math.max(0, Math.min(1, remainingSeconds / total))
    const offset = this.circumference * (1 - ratio)
    return offset
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

  public open(): void {
    this.element.style.display = 'block'
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public reset(): void {
    this.lastRemainingSeconds = undefined
    this.ensureElementsCached()

    if (this.progressValueEl !== undefined) {
      this.progressValueEl.textContent = '0'
    }

    if (this.progressBarEl !== undefined) {
      this.progressBarEl.style.transition = 'none'
      this.progressBarEl.style.strokeDashoffset = `${this.circumference}`
    }
  }

  public remove(): void {
    if (this.observer !== undefined) {
      this.observer.disconnect()
      this.observer = undefined
    }
    this.element.remove()
  }
}