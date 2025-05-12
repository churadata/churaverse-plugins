import { Position } from 'churaverse-engine-client'
import { IBossRenderer } from './IBossRenderer'

export interface IBossRendererFactory {
  build: (posistion: Position, bossHP: number) => IBossRenderer
}
