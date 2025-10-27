export interface IGameParticipationManager {
  init: (allPlayers: string[]) => void
  set: (playerId: string, isJoin: boolean) => void
  delete: (playerId: string) => boolean
  isPlayerJoined: (playerId: string) => boolean
  isAllPlayersResponded: () => boolean
  getJoinPlayers: () => string[]
  clear: () => void
  timeoutResponse: () => void
}
