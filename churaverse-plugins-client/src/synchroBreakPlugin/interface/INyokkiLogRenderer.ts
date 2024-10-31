export interface INyokkiLogRenderer {
  nyokkiLog: (message: string) => void
  noNyokkiLog: (playerIds: string[]) => void
}
