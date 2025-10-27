/**
 * ゲームごとの参加プレイヤーを管理するインターフェース
 */
export interface GameParticipationPlayers {
  /** ミニゲーム対象の全プレイヤー */
  allPlayers: Set<string>
  /** 「参加する」と回答したプレイヤー */
  joinedPlayers: Set<string>
  /** 回答済み（参加/不参加問わず）のプレイヤー */
  respondedPlayers: Set<string>
}
