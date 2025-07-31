import { ICountdownWindow, IDescriptionWindow, IResultWindow, ITimerContainer } from '../interface/IChurarenUiComponent'

export const CHURAREN_UI_KEYS = {
  DESCRIPTION_WINDOW: 'descriptionWindow',
  COUNTDOWN_WINDOW: 'countdownWindow',
  TIMER_CONTAINER: 'timerContainer',
  RESULT_WINDOW: 'resultWindow',
} as const

/**
 * ChurarenのUIコンポーネントを定義する
 */
declare module '@churaverse/game-plugin-client/gameUiManager' {
  export interface GameUiMap {
    churaren: {
      [CHURAREN_UI_KEYS.DESCRIPTION_WINDOW]: IDescriptionWindow
      [CHURAREN_UI_KEYS.COUNTDOWN_WINDOW]: ICountdownWindow
      [CHURAREN_UI_KEYS.TIMER_CONTAINER]: ITimerContainer
      [CHURAREN_UI_KEYS.RESULT_WINDOW]: IResultWindow
    }
  }
}
