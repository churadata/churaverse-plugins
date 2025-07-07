import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import { ChurarenGameResultType } from '../types/uiTypes'

export interface IDescriptionWindow extends IGameUiComponent {
  hideDescription: () => void
}

export interface ICountdownWindow extends IGameUiComponent {
  countdownTime: number
  startCountdown: () => void
  hideCountdown: () => void
}

export interface ITimerContainer extends IGameUiComponent {
  time: number
  startTimer: () => void
  hideTimer: () => void
}

export interface IResultWindow extends IGameUiComponent {
  showResult: (result: ChurarenGameResultType) => void
  hideResult: () => void
  buttonElement: HTMLElement
}
