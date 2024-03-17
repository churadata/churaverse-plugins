import { Position, Direction } from 'churaverse-engine-client'
import { PlayerColor } from '../types/playerColor'
import { IPlayerRenderer } from './IPlayerRenderer'

export interface IPlayerRendererFactory {
  build: (pos: Position, direction: Direction, name: string, color: PlayerColor, hp: number) => IPlayerRenderer
}
