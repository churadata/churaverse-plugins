import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import { NyokkiStatus } from '../type/nyokkiStatus'

export interface IOwnRankingBoard extends IGameUiComponent {
  changeNyokkiStatus: (playerId: string, status: NyokkiStatus) => void
  resetNyokkiStatus: (playerIds: string[]) => void
  changePlayersCoin: (playerId: string, coins: number) => void
  updateRanking: () => void
}
