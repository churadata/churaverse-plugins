import { IDescriptionWindow } from '../interface/IDescriptionWindow'
import { TimeLimitFormContainer } from './timeLimitFormContainer/timeLimitFormContainer'

/**
 * SynchroBreakのUIコンポーネントを定義する
 */
declare module '@churaverse/game-plugin-client/gameUiManager' {
  export interface GameUiMap {
    synchroBreak: {
      descriptionWindow: IDescriptionWindow
      timeLimitConfirm: TimeLimitFormContainer
    }
  }
}
