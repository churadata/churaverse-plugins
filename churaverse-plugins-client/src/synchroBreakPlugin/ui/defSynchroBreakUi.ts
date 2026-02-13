import { IDescriptionWindow } from '../interface/IDescriptionWindow'
import { IOwnRankingBoard } from '../interface/IOwnRankingBoard'
import { TurnSelectFormContainer } from './turnSelectFormContainer/turnSelectFormContainer'
import { TimeLimitFormContainer } from './timeLimitFormContainer/timeLimitFormContainer'
import { BetCoinFormContainer } from './betCoinFormContainer/betCoinFormContainer'
import { NyokkiButton } from './nyokkiButton/nyokkiButton'
import { ResultScreen } from './resultScreen/resultScreen'
import { CountdownBar } from './countDownBar/countDownBar'
import { BetTimer } from './betTimer/betTimer'

/**
 * SynchroBreakのUIコンポーネントを定義する
 */
declare module '@churaverse/game-plugin-client/gameUiManager' {
  export interface GameUiMap {
    synchroBreak: {
      descriptionWindow: IDescriptionWindow
      ownRankingBoard: IOwnRankingBoard
      turnSelectConfirm: TurnSelectFormContainer
      timeLimitConfirm: TimeLimitFormContainer
      betCoinConfirm: BetCoinFormContainer
      nyokkiButton: NyokkiButton
      resultScreen: ResultScreen
      countdownBar: CountdownBar
      betTimer: BetTimer
    }
  }
}
