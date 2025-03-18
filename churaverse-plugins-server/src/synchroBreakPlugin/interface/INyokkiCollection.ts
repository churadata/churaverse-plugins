import { Nyokki } from '../model/nyokki'

export interface INyokkiCollection {
  set: (playerId: string, nyokki: Nyokki | undefined) => void
  delete: (playerId: string) => void
  get: (playerId: string) => Nyokki | undefined
  makeNyokki: (playerId: string, isNyokki: boolean) => void
  clear: () => void
  getAllPlayerId: () => string[]
  playerOrders: () => string[]
}
