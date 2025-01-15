import { Store, IMainScene } from 'churaverse-engine-client'
import { GameUiRegister } from '@churaverse/game-plugin-client/gameUiRegister'
import { GameIds } from '@churaverse/game-plugin-client/interface/gameIds'
import { DescriptionWindow } from './descriptionWindow/descriptionWindow'
import { TimeLimitFormContainer } from './timeLimitFormContainer/timeLimitFormContainer'

/**
 * シンクロブレイクのUIを登録する
 */
export function registerSynchroBreakUi(
  store: Store<IMainScene>,
  gameId: GameIds,
  gameUiRegister: GameUiRegister
): void {
  gameUiRegister.registerGameUi(gameId, 'descriptionWindow', new DescriptionWindow())
  gameUiRegister.registerGameUi(gameId, 'timeLimitConfirm', new TimeLimitFormContainer(store))
}
