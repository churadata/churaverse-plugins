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

          const percentStr = this.element.dataset.percent
          const durationStr = this.element.dataset.duration
          const startPositionStr = this.element.dataset.startPosition
          const strokeColor = this.element.dataset.strokeColor
          const strokeWidth = this.element.dataset.strokeWidth

          if (percentStr !== undefined) {
            const percent = parseFloat(percentStr) // この値は残り秒数の表示に使う
            const duration = durationStr !== undefined ? parseFloat(durationStr) : 1 // 秒
            const startPosition = (startPositionStr ?? 'top') as NonNullable<CountDownBarProps['startPosition']>

            const progressBar = this.element.querySelector<SVGCircleElement>(`.${styles.progressBar}`)
            const progressValue = this.element.querySelector<HTMLDivElement>(`.${styles.progressValue}`)

            if (progressBar !== null) {
              const radius = 45
              const circumference = 2 * Math.PI * radius
              // カウントダウン: 初期はフル表示（offset=0）から、duration秒かけて空（offset=circumference）へ減少させる
              const offset = 0

              // 開始位置の回転
              let startRotate = -90
              if (startPosition === 'right') startRotate = 0
              else if (startPosition === 'bottom') startRotate = 90
              else if (startPosition === 'left') startRotate = 180
              else if (startPosition === 'top' || startPosition === 'default') startRotate = -90

              // 初期スタイル（即時反映、トランジションなし）
              progressBar.style.transition = 'none'
              progressBar.style.setProperty('--start-rotate', `${startRotate}deg`)
              if (strokeColor !== undefined) progressBar.style.setProperty('--stroke-color', strokeColor)
              if (strokeWidth !== undefined) progressBar.style.setProperty('--stroke-width', `${strokeWidth}`)
              // dasharray は SCSS 側で固定、ここでは offset のみ操作
              progressBar.style.strokeDashoffset = `${offset}`

              // Reflow して初期値を確定
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              progressBar.getBoundingClientRect()

              // トランジションを設定して、空(=circumference)へ遷移
              progressBar.style.transition = `stroke-dashoffset ${duration}s linear`
              progressBar.style.strokeDashoffset = `${circumference}`
            }

            if (progressValue !== null) {
              progressValue.textContent = Math.floor(percent).toString()
            }
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
   * 中央の数値表示のみ更新する（バーのアニメ自体は duration ベースで進行）
   */
  public updateValue(remainingSeconds: number): void {
    const progressValue = this.element.querySelector<HTMLDivElement>(`.${styles.progressValue}`)
    if (progressValue !== null) {
      progressValue.textContent = Math.floor(remainingSeconds).toString()
    }
  }
}
