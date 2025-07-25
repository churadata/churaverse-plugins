import { Position } from 'churaverse-engine-client'

/**
 * TrapRenderの抽象
 * 主語はTrap
 */
export interface ITrapAttackRenderer {
  /**
   * walk Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   */
  spawn: (source: Position) => void
  collide: () => void
  dead: () => void
}
