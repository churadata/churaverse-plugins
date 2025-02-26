import { GameIds } from './gameIds'

/**
 * 各ゲームのメタ情報を管理するリポジトリのインターフェース
 */
export interface IGameInfoRepository<T> {
  set: (id: GameIds, entity: T) => void
  delete: (id: GameIds) => void
  get: (id: GameIds) => T | undefined
  getAllId: () => GameIds[]
}
