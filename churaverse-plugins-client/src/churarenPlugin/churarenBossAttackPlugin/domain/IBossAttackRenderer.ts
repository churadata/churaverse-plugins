import { Position, Direction } from 'churaverse-engine-client'

/**
 * boss Attack描画のためのインタフェース
 */
export interface IBossAttackRenderer {
  /**
   * walk Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   */
  attack: (position: Position, dest: Position, direction: Direction, onUpdate: (pos: Position) => void) => void
  dead: () => void
}
