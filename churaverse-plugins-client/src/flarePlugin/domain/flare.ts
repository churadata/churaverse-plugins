import { Entity, WeaponEntity, Position, Direction } from 'churaverse-engine-client'

export const FLARE_SPREAD_LIMIT_GRIDS = 6

/**
 * flareクラス
 */
export class Flare extends Entity implements WeaponEntity {
  public readonly power = 50
  public isDead = false
  public flareId: string
  public ownerId: string
  public spawnTime: number
  public readonly id: string

  public constructor(flareId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(position, direction)
    this.id = flareId
    this.flareId = flareId
    this.ownerId = ownerId
    this.spawnTime = spawnTime
  }

  /**
   * 移動
   * @param position 宛先
   */
  public spread(position: Position): void {
    this.position.x = position.x
    this.position.y = position.y
  }

  /**
   * 消滅
   */
  public die(): void {
    this.isDead = true
  }
}
