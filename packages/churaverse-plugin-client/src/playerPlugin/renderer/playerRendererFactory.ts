import { Scene } from 'phaser'
import { IPlayerRenderer } from '../domain/IPlayerRenderer'
import { PlayerRenderer } from './playerRenderer'
import { Position, Direction } from 'churaverse-engine-client'
import { PlayerColor } from '../types/playerColor'
import { IPlayerRendererFactory } from '../domain/IPlayerRendererFactory'

export class PlayerRendererFactory implements IPlayerRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(
    position: Position,
    direction: Direction,
    name: string,
    color: PlayerColor,
    hp: number
  ): IPlayerRenderer {
    return new PlayerRenderer(this.scene, position, direction, name, color, hp)
  }
}
