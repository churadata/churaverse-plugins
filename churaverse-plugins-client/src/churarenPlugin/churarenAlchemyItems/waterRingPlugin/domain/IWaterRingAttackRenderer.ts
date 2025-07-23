import { Position } from 'churaverse-engine-client'

/**
 * WaterRingRenderの抽象
 * 主語はWaterRing
 */
export interface IWaterRingAttackRenderer {
  /**
   * walk Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   */
  setInitPosition: (pos: Position) => void
  spawn: (source: Position) => void
  chase: (dest: Position, speed: number, onUpdate: (pos: Position) => void) => void
  dead: () => void
}
