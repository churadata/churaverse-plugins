import { Position } from "churaverse-engine-client"

/**
 * ItemRenderの抽象
 * 主語はItem
 */
export interface IItemRenderer {
  spawn: (source: Position) => void
  chase: (dest: Position, speed: number, onUpdate: (pos: Position) => void) => void
  destroy: () => void
}
