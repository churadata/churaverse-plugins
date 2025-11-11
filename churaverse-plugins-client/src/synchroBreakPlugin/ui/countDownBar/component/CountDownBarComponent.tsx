import { JSXFunc } from 'churaverse-engine-client'
import style from './CountDownBarComponent.module.scss'

export interface CountDownBarProps {
  remainingSeconds: number
  duration?: number
  startPosition?: 'right' | 'bottom' | 'left' | 'top' | 'default'
  strokeColor?: string
  strokeWidth?: number
  /** 残り秒数がこの値以下になったら警告色に切り替え（デフォルト: 5秒） */
  alertThresholdSeconds?: number
  /** 警告色（デフォルト: 赤 #e74c3c） */
  alertColor?: string
}

export const CountDownBarComponent: JSXFunc<CountDownBarProps> = ({
  remainingSeconds,
  duration,
  startPosition = 'top',
  strokeColor = '#ff7b52',
  strokeWidth = 10,
  alertThresholdSeconds,
  alertColor,
}: CountDownBarProps) => {
  return (
    <div
      className={`${style.progressItem} progress-item`}
      data-remaining-seconds={String(remainingSeconds)}
      data-duration={String(duration)}
      data-start-position={startPosition}
      data-stroke-color={strokeColor}
      data-stroke-width={String(strokeWidth)}
      data-alert-threshold-seconds={alertThresholdSeconds !== undefined ? String(alertThresholdSeconds) : undefined}
      data-alert-color={alertColor}
    >
      <svg className={style.svg} viewBox="0 0 100 100">
        <circle className={style.bgCircle} cx="50" cy="50" r="45" />
        <circle className={`${style.progressBar} progress-bar`} cx="50" cy="50" r="45" />
      </svg>
      <div className={`${style.progressValue} progress-value`}>0</div>
    </div>
  )
}
