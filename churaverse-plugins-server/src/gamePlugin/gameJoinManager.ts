import { IGameJoinManager } from './interface/IGameJoinManager'

/**
 * 各ゲームの参加プレイヤーを管理するクラス
 * - 参加可否の回答管理
 * - 途中参加プレイヤーの管理
 * - タイムアウト時の自動不参加設定
 */
export class GameJoinManager implements IGameJoinManager {
  /** ミニゲーム対象の全プレイヤー */
  private allPlayers = new Set<string>()
  /** 「参加する」と回答したプレイヤー */
  private readonly joinedPlayers = new Set<string>()
  /** 回答済み（参加/不参加問わず）のプレイヤー */
  private readonly respondedPlayers = new Set<string>()

  public setAllPlayers(allPlayers: string[]): void {
    this.allPlayers = new Set(allPlayers)
  }

  public recordResponse(playerId: string, willJoin: boolean): void {
    this.respondedPlayers.add(playerId)
    if (willJoin) this.joinedPlayers.add(playerId)
  }

  public delete(playerId: string): boolean {
    this.allPlayers.delete(playerId)
    this.respondedPlayers.delete(playerId)
    return this.joinedPlayers.delete(playerId)
  }

  public isAllPlayersResponded(): boolean {
    return this.allPlayers.size === this.respondedPlayers.size
  }

  public getJoinedPlayerIds(): string[] {
    return Array.from(this.joinedPlayers)
  }

  public clear(): void {
    this.allPlayers.clear()
    this.joinedPlayers.clear()
    this.respondedPlayers.clear()
  }

  public timeoutResponse(): void {
    this.allPlayers.forEach((playerId) => {
      if (this.respondedPlayers.has(playerId)) return
      this.respondedPlayers.add(playerId)
    })
  }

  public midwayJoinPlayer(playerId: string): void {
    if (this.allPlayers === undefined) return
    this.allPlayers.add(playerId)
    this.joinedPlayers.add(playerId)
    this.respondedPlayers.add(playerId)
  }
}
