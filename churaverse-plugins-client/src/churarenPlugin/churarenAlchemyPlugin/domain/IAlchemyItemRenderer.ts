import { Position } from 'churaverse-engine-client'

export interface IAlchemyItemRenderer {
  setInitPosition: (pos: Position) => void
  spawn: (source: Position) => void
  chase: (dest: Position, speed: number, onUpdate: (pos: Position) => void) => void
  destroy: () => void
}
