import { JSXFunc } from 'churaverse-engine-client'
import style from './CountDownBarComponent.module.scss'

export interface CountDownBarProps {
  remainingSeconds: number
  duration?: number
  strokeColor?: string
  strokeWidth?: number
  alertThresholdSeconds?: number
  alertColor?: string
}

export const CountDownBarComponent: JSXFunc<CountDownBarProps> = ({
  remainingSeconds,
  duration,
  strokeColor = '#3c79c4',
  strokeWidth = 10,
  alertThresholdSeconds,
  alertColor,
}: CountDownBarProps) => {
  return (
    <div
      className={`${style.progressItem} progress-item`}
      data-remaining-seconds={String(remainingSeconds)}
      data-duration={String(duration)}
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
