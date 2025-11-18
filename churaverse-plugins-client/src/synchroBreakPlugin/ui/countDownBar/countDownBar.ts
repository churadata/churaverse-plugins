import { DomManager } from 'churaverse-engine-client'
import { CountDownBarComponent, CountDownBarProps } from './component/CountDownBarComponent'
import styles from './component/CountDownBarComponent.module.scss'

/**
 * 円形カウントダウンバー
 * - 中央に残り秒数を表示（percent をそのまま数値表示）
 */
export class CountDownBar {
  public element!: HTMLElement
  private observer: IntersectionObserver | null = null
  private totalDuration: number = 1
  private lastRemainingSeconds: number | null = null
  private readonly radius = 45
  private readonly circumference = 2 * Math.PI * this.radius

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
          const strokeColor = this.element.dataset.strokeColor
          const strokeWidth = this.element.dataset.strokeWidth
          const alertThresholdStr = this.element.dataset.alertThresholdSeconds
          const alertColor = this.element.dataset.alertColor

          if (remainingSecondsStr !== undefined) {
            const remainingSeconds = parseFloat(remainingSecondsStr)
            const duration = durationStr !== undefined ? parseFloat(durationStr) : 1 // 秒
            this.totalDuration = duration > 0 ? duration : 1
            const alertThreshold = alertThresholdStr !== undefined ? parseFloat(alertThresholdStr) : 3

            const progressBar = this.element.querySelector<SVGCircleElement>(`.${styles.progressBar}`)
            const progressValue = this.element.querySelector<HTMLDivElement>(`.${styles.progressValue}`)

            if (progressBar !== null) {
              // 初期スタイル（即時反映、トランジションなし）
              progressBar.style.transition = 'none'
              progressBar.style.setProperty('--start-rotate', `${-90}deg`)
              if (strokeColor !== undefined) progressBar.style.setProperty('--stroke-color', strokeColor)
              if (alertColor !== undefined) progressBar.style.setProperty('--alert-stroke-color', alertColor)
              if (strokeWidth !== undefined) progressBar.style.setProperty('--stroke-width', `${strokeWidth}`)
              // 比率からオフセットを即時反映（サーバ同期初期値）
              const ratio = Math.max(0, Math.min(1, remainingSeconds / this.totalDuration))
              const offset = this.circumference * (1 - ratio)
              progressBar.style.strokeDashoffset = `${offset}`
              // Reflow して初期値を確定後、短いトランジションに切替
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              progressBar.getBoundingClientRect()
              progressBar.style.transition = 'stroke-dashoffset 0.25s linear, stroke 0.3s ease'
            }

            if (progressValue !== null) {
              progressValue.textContent = Math.floor(remainingSeconds).toString()
            }

            // 初期残秒がしきい値以下なら即時警告色に変更／解除
            if (progressBar !== null) {
              if (remainingSeconds <= alertThreshold) progressBar.classList.add(styles.alert)
              else progressBar.classList.remove(styles.alert)
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
  public updateValue(remainingSeconds: number): void {
    const progressValue = this.element.querySelector<HTMLDivElement>(`.${styles.progressValue}`)
    const progressBar = this.element.querySelector<SVGCircleElement>(`.${styles.progressBar}`)
    if (progressValue !== null) {
      progressValue.textContent = Math.floor(remainingSeconds).toString()
    }
    const alertThresholdStr = this.element.dataset.alertThresholdSeconds
    const alertThreshold = alertThresholdStr !== undefined ? parseFloat(alertThresholdStr) : 3
    if (progressBar !== null) {
      // 警告色切替
      if (remainingSeconds <= alertThreshold) progressBar.classList.add(styles.alert)
      else progressBar.classList.remove(styles.alert)

      // 比率からオフセットを同期
      const total = this.totalDuration > 0 ? this.totalDuration : 1
      const ratio = Math.max(0, Math.min(1, remainingSeconds / total))
      const newOffset = this.circumference * (1 - ratio)

      const prev = this.lastRemainingSeconds ?? remainingSeconds
      const isJump = Math.abs(remainingSeconds - prev) > 2
      if (isJump) {
        // 大きく飛んだら瞬間補正→次フレームでトランジション復帰
        const prevTransition = progressBar.style.transition
        progressBar.style.transition = 'none'
        progressBar.style.strokeDashoffset = `${newOffset}`
        // reflow
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        progressBar.getBoundingClientRect()
        requestAnimationFrame(() => {
          progressBar.style.transition =
            prevTransition !== '' ? prevTransition : 'stroke-dashoffset 0.25s linear, stroke 0.3s ease'
        })
      } else {
        if (progressBar.style.transition === '') {
          progressBar.style.transition = 'stroke-dashoffset 0.25s linear, stroke 0.3s ease'
        }
        progressBar.style.strokeDashoffset = `${newOffset}`
      }
    }
    this.lastRemainingSeconds = remainingSeconds
  }
}
