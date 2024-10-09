export interface IGameLogRenderer {
  gameStartLog: (playerId: string, gameName: string) => void
  gameEndLog: (playerId: string, gameName: string) => void
  abortGameLog: (playerId: string) => void
}
