import { IDescriptionWindow } from '../interface/IDescriptionWindow'
import { IRankingBoard } from '../interface/IRankingBoard'
import { TurnSelectFormContainer } from './turnSelectFormContainer/turnSelectFormContainer'
import { TimeLimitFormContainer } from './timeLimitFormContainer/timeLimitFormContainer'
import { BetCoinFormContainer } from './betCoinFormContainer/betCoinFormContainer'

/**
 * SynchroBreakのUIコンポーネントを定義する
 */
declare module '@churaverse/game-plugin-client/gameUiManager' {
  export interface GameUiMap {
    synchroBreak: {
      descriptionWindow: IDescriptionWindow
      rankingBoard: IRankingBoard
      turnSelectConfirm: TurnSelectFormContainer
      timeLimitConfirm: TimeLimitFormContainer
      betCoinConfirm: BetCoinFormContainer
    }
  }
}
