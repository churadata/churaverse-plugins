import { Nyokki } from '../model/nyokki'
import { INyokkiCollection } from '../interface/INyokkiCollection'

/**
 * nyokkiCollectionで各プレイヤーのnyokkiの状態を保存する
 */
export class NyokkiCollection implements INyokkiCollection {
  public readonly userNyokkiMap: Map<string, Nyokki>

  public constructor() {
    this.userNyokkiMap = new Map<string, Nyokki>()
  }

  public set(id: string, nyokki: Nyokki | undefined): void {
    if (nyokki === undefined) return

    this.userNyokkiMap.set(id, nyokki)
  }

  public delete(playerId: string): void {
    this.userNyokkiMap.delete(playerId)
  }

  public get(playerId: string): Nyokki | undefined {
    return this.userNyokkiMap.get(playerId)
  }

  public makeNyokki(playerId: string, isNyokki: boolean): void {
    const nyokki = this.userNyokkiMap.get(playerId)
    if (nyokki === undefined) return

    nyokki.nyokki(isNyokki)
    this.set(playerId, nyokki)
  }

  public clear(): void {
    this.userNyokkiMap.clear()
  }

  /**
   * @return ニョッキしたプレイヤーのIDの配列
   */
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
