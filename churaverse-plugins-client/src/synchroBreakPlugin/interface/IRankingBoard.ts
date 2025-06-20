import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import { NyokkiStatus } from '../type/nyokkiStatus'

export interface IRankingBoard extends IGameUiComponent {
  addRankingElement: (playerId: string, rank: number, coins: number) => void
  changeNyokkiStatus: (playerId: string, status: NyokkiStatus) => void
  resetNyokkiStatus: (playerIds: string[]) => void
  changePlayersCoin: (playerId: string, coins: number) => void
  updateRanking: () => void
  updateTurnNumber: (turnNumber: number, turnLeft: number) => void
}
