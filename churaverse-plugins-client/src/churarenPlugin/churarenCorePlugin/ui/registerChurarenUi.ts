import { Store, IMainScene } from 'churaverse-engine-client'
import { GameUiRegister } from '@churaverse/game-plugin-client/gameUiRegister'
import { GameIds } from '@churaverse/game-plugin-client/interface/gameIds'
import { DescriptionWindow } from './descriptionWindow/descriptionWindow'
import { CountdownWindow } from './countdownWindow/countdownWindow'
import { TimerContainer } from './timerContainer/timerContainer'
import { ResultWindow } from './resultWindow/resultWindow'
import { CHURAREN_UI_KEYS } from './defChurarenUi'
/**
 * churarenのUIを登録する
 */
export function registerChurarenUi(store: Store<IMainScene>, gameId: GameIds, gameUiRegister: GameUiRegister): void {
  gameUiRegister.registerGameUi(
    gameId,
    CHURAREN_UI_KEYS.DESCRIPTION_WINDOW,
    new DescriptionWindow(store, store.of('playerPlugin').ownPlayerId)
  )
  gameUiRegister.registerGameUi(gameId, CHURAREN_UI_KEYS.COUNTDOWN_WINDOW, new CountdownWindow())
  gameUiRegister.registerGameUi(gameId, CHURAREN_UI_KEYS.TIMER_CONTAINER, new TimerContainer())
  gameUiRegister.registerGameUi(gameId, CHURAREN_UI_KEYS.RESULT_WINDOW, new ResultWindow())
}
