import { DamageCause, DamageCauseType } from "churaverse-engine-server"
import { IChurarenCollidable } from "@churaverse/churaren-engine-server"
import { ICollidableEntity } from "@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity"

/**
 * ボスとの当たり判定によるダメージの抽象クラス
 * @param collisionName 当たり判定の名前
 * @param collisionEntity 当たり判定のエンティティ
 */
export class CollisionBossDamageCause extends DamageCause implements IChurarenCollidable {
  private readonly collisionBoss: DamageCauseType
  private readonly boss: ICollidableEntity
  public constructor(
    public readonly collisionName: DamageCauseType,
    public readonly collisionEntity: ICollidableEntity
  ) {
    super('collisionBoss')
    this.collisionBoss = collisionName
    this.boss = collisionEntity
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    collisionBoss: CollisionBossDamageCause
  }
}
