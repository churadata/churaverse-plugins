import { Position, Direction, Vector } from 'churaverse-engine-server'
import { PlayerColor } from '../types/playerColor'
import { PlayerRole } from '../types/playerRole'

export interface IPlayer {
  readonly id: string
  readonly color: PlayerColor
  readonly name: string
  readonly velocity: Vector
  readonly isDead: boolean
  readonly role: PlayerRole
  readonly spawnTime: number
  isCollidable: boolean

  turn: (direction: Direction) => void
  walk: (position: Position, direction: Direction, velocity: Vector) => void
  stop: () => void
  teleport: (position: Position) => void
  damage: (amount: number) => void
  respawn: (position: Position) => void
  setPlayerName: (name: string) => void
  setPlayerColor: (colorName: PlayerColor) => void
  move: (dt: number) => void
}
