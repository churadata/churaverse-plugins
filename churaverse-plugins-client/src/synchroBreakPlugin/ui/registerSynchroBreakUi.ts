import { Store, IMainScene } from 'churaverse-engine-client'
import { GameUiRegister } from '@churaverse/game-plugin-client/gameUiRegister'
import { GameIds } from '@churaverse/game-plugin-client/interface/gameIds'
import { DescriptionWindow } from './descriptionWindow/descriptionWindow'
import { RankingBoard } from './rankingBoard/rankingBoard'
import { TurnSelectFormContainer } from './turnSelectFormContainer/turnSelectFormContainer'
import { TimeLimitFormContainer } from './timeLimitFormContainer/timeLimitFormContainer'
import { BetCoinFormContainer } from './betCoinFormContainer/betCoinFormContainer'

/**
 * シンクロブレイクのUIを登録する
 */
export function registerSynchroBreakUi(
  store: Store<IMainScene>,
  gameId: GameIds,
  gameUiRegister: GameUiRegister
): void {
  gameUiRegister.registerGameUi(gameId, 'descriptionWindow', new DescriptionWindow())
  gameUiRegister.registerGameUi(gameId, 'rankingBoard', new RankingBoard())
  gameUiRegister.registerGameUi(gameId, 'turnSelectConfirm', new TurnSelectFormContainer(store))
  gameUiRegister.registerGameUi(gameId, 'timeLimitConfirm', new TimeLimitFormContainer(store))
  gameUiRegister.registerGameUi(gameId, 'betCoinConfirm', new BetCoinFormContainer(store))
}
