export interface IGameJoinManager {
  /**
   * 参加対象の全プレイヤーID配列を初期化する
   * @param allPlayers 参加対象の全プレイヤーID配列
   * @returns
   */
  init: (allPlayers: string[]) => void

  /**
   * プレイヤーの参加状況を設定する
   * @param playerId 参加するプレイヤーのID
   * @param willJoin 参加する場合はtrue、退出する場合はfalse
   * @returns
   */
  set: (playerId: string, willJoin: boolean) => void

  /**
   * 参加者リストからプレイヤーを削除する
   * @param playerId 退出するプレイヤーのID
   * @returns 削除に成功した場合はtrue、参加者リストに存在しなかった場合はfalse
   */
  delete: (playerId: string) => boolean

  /**
   * 全プレイヤーが参加/不参加の回答を済ませているかどうか
   * @returns 全プレイヤーが参加/不参加の回答を済ませているかどうか
   */
  isAllPlayersResponded: () => boolean

  /**
   * 参加しているプレイヤーID配列を取得する
   * @returns 参加しているプレイヤーID配列
   */
  getParticipantIds: () => string[]

  /**
   * 参加情報をクリアする
   */
  clear: () => void

  /**
   * タイムアウト処理を実行する
   * @returns 全てのプレイヤーを回答済みにする
   */
  timeoutResponse: () => void

  /**
   * 途中参加するプレイヤーを参加者リストに追加する
   * @param playerId 途中参加するプレイヤーのID
   * @returns
   */
  midwayJoinPlayer: (playerId: string) => void
}
