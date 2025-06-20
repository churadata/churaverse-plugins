export interface INyokkiLogTextCreator {
  createNyokkiLogText: (playerIds: string[], isSuccess: boolean, nyokkiTime: number) => string
  createNoNyokkiLogText: (playerIds: string[]) => string
}
