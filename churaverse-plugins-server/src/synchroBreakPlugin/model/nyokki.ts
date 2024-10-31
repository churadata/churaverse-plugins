export type NyokkiStatus = 'yet' | 'success' | 'nyokki'

export class Nyokki {
  public readonly playerId: string
  public readonly nyokkiTime: number
  private nyokkiStatus: NyokkiStatus

  public constructor(playerId: string, nyokkiTime: number) {
    this.playerId = playerId
    this.nyokkiTime = nyokkiTime

    this.nyokkiStatus = 'yet'
  }

  public nyokki(isNyokki: boolean): void {
    this.nyokkiStatus = isNyokki ? 'nyokki' : 'success'
  }

  public get getNyokkiStatus(): NyokkiStatus {
    return this.nyokkiStatus
  }
}
