import { Store, IMainScene, IEventBus } from 'churaverse-engine-client'
import { GameUiRegister } from '@churaverse/game-plugin-client/gameUiRegister'
import { GameIds } from '@churaverse/game-plugin-client/interface/gameIds'
import { DescriptionWindow } from './descriptionWindow/descriptionWindow'
import { OwnRankingBoard } from './rankingBoard/ownRankingBoard'
import { TurnSelectFormContainer } from './turnSelectFormContainer/turnSelectFormContainer'
import { TimeLimitFormContainer } from './timeLimitFormContainer/timeLimitFormContainer'
import { BetCoinFormContainer } from './betCoinFormContainer/betCoinFormContainer'
import { NyokkiButton } from './nyokkiButton/nyokkiButton'
import { ResultScreen } from './resultScreen/resultScreen'
import { CountdownBar } from './countdownBar/countdownBar'
import { Scene } from 'phaser'
import { BetTimer } from './betTimer/betTimer'

/**
 * シンクロブレイクのUIを登録する
 */
export function registerSynchroBreakUi(
  store: Store<IMainScene>,
  bus: IEventBus<IMainScene>,
  scene: Scene,
  gameId: GameIds,
  gameUiRegister: GameUiRegister
): void {
  gameUiRegister.registerGameUi(gameId, 'descriptionWindow', new DescriptionWindow())
  gameUiRegister.registerGameUi(gameId, 'ownRankingBoard', new OwnRankingBoard(store))
  gameUiRegister.registerGameUi(gameId, 'turnSelectConfirm', new TurnSelectFormContainer(store))
  gameUiRegister.registerGameUi(gameId, 'timeLimitConfirm', new TimeLimitFormContainer(store))
  gameUiRegister.registerGameUi(gameId, 'betCoinConfirm', new BetCoinFormContainer(store))
  gameUiRegister.registerGameUi(gameId, 'nyokkiButton', new NyokkiButton(store, bus, scene))
  gameUiRegister.registerGameUi(gameId, 'resultScreen', new ResultScreen(store, bus))
  gameUiRegister.registerGameUi(gameId, 'countdownBar', new CountdownBar())
  gameUiRegister.registerGameUi(gameId, 'betTimer', new BetTimer())
}
