import { IGameUi } from './IGameUi'
import { boardProps, NyokkiStatus } from '../ui/component/BoardElement'

export interface IRankingBoard extends IGameUi {
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
