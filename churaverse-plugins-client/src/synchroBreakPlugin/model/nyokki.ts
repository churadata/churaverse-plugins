export class Nyokki {
  private readonly playerId: string
  private readonly nyokkiTime: number | undefined

  // nyokkiStatusは状態、actionStatusはNyokkiをしたかどうかの値
  private nyokkiStatus: boolean
  private actionStatus: boolean

  public constructor(playerId: string, nyokkiTime: number | undefined = undefined) {
    this.playerId = playerId
    this.nyokkiTime = nyokkiTime

    this.nyokkiStatus = false
    this.actionStatus = false
  }

  public nyokki(): void {
    this.nyokkiStatus = true
    this.actionStatus = true
  }

  public isNyokki(): boolean {
    return this.nyokkiStatus
  }

  public isAction(): boolean {
    return this.actionStatus
  }

  public getPlayerId(): string {
    return this.playerId
  }

  public getNyokkiTime(): number | undefined {
    return this.nyokkiTime
  }
}
