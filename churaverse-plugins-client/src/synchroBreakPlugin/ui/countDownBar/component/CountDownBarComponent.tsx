import { JSXFunc } from 'churaverse-engine-client'
import style from './CountDownBarComponent.module.scss'

export interface CountDownBarProps {
  percent: number
  duration?: number
  startPosition?: 'right' | 'bottom' | 'left' | 'top' | 'default'
  strokeColor?: string
  strokeWidth?: number
}

export const CountDownBarComponent: JSXFunc<CountDownBarProps> = ({
  percent,
  duration,
  startPosition = 'top',
  strokeColor = '#ff7b52',
  strokeWidth = 10,
}: CountDownBarProps) => {
  return (
    <div
      className={`${style.progressItem} progress-item`}
      data-percent={String(percent)}
      data-duration={String(duration)}
      data-start-position={startPosition}
      data-stroke-color={strokeColor}
      data-stroke-width={String(strokeWidth)}
    >
      <svg className={style.svg} viewBox="0 0 100 100">
        <circle className={style.bgCircle} cx="50" cy="50" r="45" />
        <circle className={`${style.progressBar} progress-bar`} cx="50" cy="50" r="45" />
      </svg>
      <div className={`${style.progressValue} progress-value`}>0</div>
    </div>
  )
}
