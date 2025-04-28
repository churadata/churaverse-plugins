import { ICollidableEntity } from "@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity"
import { IRectangle } from "@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle"
import { Direction, LivingEntity, Position, Vector } from "churaverse-engine-server"

export const CHURAREN_BOSS_WALK_DURATION_MS = 1000
export const CHURAREN_BOSS_SIZE = 150

export class Boss extends LivingEntity implements ICollidableEntity {
  public isCollidable = true
  public readonly bossId: string
  public readonly spawnTime: number
  public readonly power = 40
  private _velocity: Vector

  public get id(): string {
    return this.bossId
  }

  public getRect(): IRectangle {
    return {
      width: CHURAREN_BOSS_SIZE,
      height: CHURAREN_BOSS_SIZE,
      position: this.position.copy(),
    }
  }

  public constructor(bossId: string, position: Position, spawnTime: number, hp: number) {
    super(position, Direction.down, hp)
    this.bossId = bossId
    this.spawnTime = spawnTime

    this._velocity = { x: 0, y: 0 }
  }

  /**
   * ボスのHPを減らす
   * @param amount ダメージ量
   */
  public damage(amount: number): void {
    this.hp -= amount
  }

  /**
   * ボスのHPが0以下かどうか
   */
  public get isDead(): boolean {
    return this.hp <= 0
  }

  public walk(position: Position, direction: Direction, velocity: Vector): void {
    this.position.x = position.x
    this.position.y = position.y
    this.direction = direction
    this._velocity = velocity
  }

  public move(dt: number): void {
    this.position.x += this._velocity.x * dt
    this.position.y += this._velocity.y * dt
  }

  public stop(): void {
    this._velocity = { x: 0, y: 0 }
  }
}
