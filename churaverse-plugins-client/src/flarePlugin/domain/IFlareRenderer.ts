import { Position, Direction } from 'churaverse-engine-client'

/**
 * 炎描画のためのインタフェース
 */
export interface IFlareRenderer {
  setSpriteId: (id: string) => void
  /**
   * spread Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   */
  spread: (position: Position, dest: Position, direction: Direction, onUpdate: (pos: Position) => void) => void
  // 追加：
  propagate: (position: Position, direction: Direction, length?: number, delayMs?: number) => void
  
  dead: () => void
}
