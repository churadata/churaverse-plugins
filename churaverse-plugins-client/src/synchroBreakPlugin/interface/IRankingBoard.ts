import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import { boardProps } from '../ui/rankingBoard/component/BoardElement'
import { NyokkiStatus } from '../type/nyokkiStatus'

export interface IRankingBoard extends IGameUiComponent {
  removeBoardElement: (playerId: string) => void
  changeNyokkiStatus: (playerId: string, status: NyokkiStatus) => void
  changePlayersCoin: (playerId: string, coins: number) => Promise<void>
  changePlayerName: (playerId: string, newPlayerName: string) => void
  addBoardElement: (setupData: boardProps, isActive: boolean) => void
  resetPlayerCoins: () => Promise<void>
  updateRanking: () => void
  playersElementArray: Array<[string, HTMLElement]>
  updateTurnNumber: (turnNumber: number, turnLeft: number) => void
  allPlayerStatusReset: () => void
  getPlayerOrders: (playerId: string) => number
  getPlayerStatus: (playerId: string) => string
  resetPlayerOrders: () => void
  getTotalPlayerNum: () => number
  resetVisible: () => void
}
