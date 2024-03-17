import { Entity, WeaponEntity, Position, Direction } from 'churaverse-engine-client'

/**
 * Bombクラス
 */
export class Bomb extends Entity implements WeaponEntity {
  public readonly power = 50
  public readonly timeLimit = 875
  public bombId: string
  public ownerId: string
  public spawnTime: number

  public constructor(bombId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(position, Direction.down)
    this.bombId = bombId
    this.ownerId = ownerId
    this.spawnTime = spawnTime
  }

  public explode(): void {}

  // public attack(entity: Entity): void {
  //   entity.damage(this.power)
  // }
}
