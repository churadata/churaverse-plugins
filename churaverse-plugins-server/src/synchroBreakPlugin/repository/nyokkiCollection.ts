import { Nyokki, NyokkiStatus } from '../model/nyokki'

/**
 * nyokkiCollectionで各プレイヤーのnyokkiの状態を保存する
 */
export class NyokkiCollection {
  public readonly userNyokkiMap: Map<string, Nyokki>

  public constructor() {
    this.userNyokkiMap = new Map<string, Nyokki>()
  }

  public set(id: string, nyokki: Nyokki | undefined): void {
    if (nyokki === undefined) return

    this.userNyokkiMap.set(id, nyokki)
  }

  public delete(id: string): void {
    this.userNyokkiMap.delete(id)
  }

  public get(id: string): Nyokki | undefined {
    return this.userNyokkiMap.get(id)
  }

  public has(id: string): boolean {
    return this.userNyokkiMap.has(id)
  }

  public getNyokkiCollectionSize(): number {
    const nyokkiCollectionSize = this.userNyokkiMap.size
    return nyokkiCollectionSize
  }

  public getNyokkiCollectionArray(): Array<[string, NyokkiStatus]> {
    const userNyokkiArray: Array<[string, NyokkiStatus]> = Array.from(this.userNyokkiMap, ([playerId, nyokki]) => [
      playerId,
      nyokki.getNyokkiStatus,
    ])
    return userNyokkiArray
  }

  public makeNyokki(id: string, isNyokki: boolean): void {
    const nyokki = this.userNyokkiMap.get(id)
    if (nyokki === undefined) return

    nyokki.nyokki(isNyokki)
    this.set(id, nyokki)
  }

  public clear(): void {
    this.userNyokkiMap.clear()
  }

  public getAllPlayerId(): string[] {
    return Array.from(this.userNyokkiMap.keys())
  }

  public playerOrders(): string[] {
    const nyokkiArray = Array.from(this.userNyokkiMap.values())
    nyokkiArray.sort((a, b) => a.nyokkiTime - b.nyokkiTime)
    const playerOrders = nyokkiArray.map((nyokki) => nyokki.playerId)

    return playerOrders
  }
}
