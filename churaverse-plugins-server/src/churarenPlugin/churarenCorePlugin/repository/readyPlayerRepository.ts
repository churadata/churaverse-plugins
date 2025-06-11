import { IReadyPlayerRepository } from '../interface/IReadyPlayerRepository'

export class ReadyPlayerRepository implements IReadyPlayerRepository {
  private readonly readyPlayers = new Set<string>()

  public set(playerId: string): void {
    this.readyPlayers.add(playerId)
  }

  public delete(playerId: string): void {
    this.readyPlayers.delete(playerId)
  }

  public has(playerId: string): boolean {
    return this.readyPlayers.has(playerId)
  }

  public getAllId(): string[] {
    return Array.from(this.readyPlayers)
  }

  public clear(): void {
    this.readyPlayers.clear()
  }

  public get size(): number {
    return this.readyPlayers.size
  }
}
