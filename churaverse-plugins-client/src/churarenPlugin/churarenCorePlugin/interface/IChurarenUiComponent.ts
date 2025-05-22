import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import { ChurarenGameResultType } from '../types/uiTypes'

export interface IDescriptionWindow extends IGameUiComponent {
  setDescriptionText: (text: string) => void
}

export interface ICountdownWindow extends IGameUiComponent {
  countdownTime: number
  startCountdown: () => void
}

export interface ITimerContainer extends IGameUiComponent {
  time: number
  startTimer: () => void
}

export interface IResultWindow extends IGameUiComponent {
  showResult: (result: ChurarenGameResultType) => void
}
