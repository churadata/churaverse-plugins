import { PlayersRepository } from '@churaverse/player-plugin-client/repository/playerRepository'

export interface IRankingListRenderer {
  updateRankingList: (players: PlayersRepository, sortedCoins: Array<[string, number]>) => void
}
