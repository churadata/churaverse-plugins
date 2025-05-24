import { IDescriptionText } from '../interface/IDescriptionText'
import { IRankingBoard } from '../interface/IRankingBoard'
import { TurnSelectFormContainer } from './turnSelectFormContainer/turnSelectFormContainer'
import { TimeLimitFormContainer } from './timeLimitFormContainer/timeLimitFormContainer'
import { BetCoinFormContainer } from './betCoinFormContainer/betCoinFormContainer'
import { NyokkiButton } from './nyokkiButton/nyokkiButton'

/**
 * SynchroBreakのUIコンポーネントを定義する
 */
declare module '@churaverse/game-plugin-client/gameUiManager' {
  export interface GameUiMap {
    synchroBreak: {
      descriptionText: IDescriptionText
      rankingBoard: IRankingBoard
      turnSelectConfirm: TurnSelectFormContainer
      timeLimitConfirm: TimeLimitFormContainer
      betCoinConfirm: BetCoinFormContainer
      nyokkiButton: NyokkiButton
    }
  }
}
