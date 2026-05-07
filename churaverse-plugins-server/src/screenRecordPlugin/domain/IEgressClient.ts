/**
 * Egressクライアントの抽象。
 * 録画開始/停止リクエストの発行を責務とする。
 */
export interface IEgressClient {
  /**
   * 指定したルームの録画を開始する
   * @param roomName 録画対象のルーム名
   * @returns 開始した録画のegressId
   */
  start: (roomName: string) => Promise<{ egressId: string }>

  /**
   * 指定したegressIdの録画を停止する
   * @param egressId 停止する録画のID
   */
  stop: (egressId: string) => Promise<void>
}
