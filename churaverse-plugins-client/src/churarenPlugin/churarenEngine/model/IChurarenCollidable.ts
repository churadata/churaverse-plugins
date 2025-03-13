import { DamageCauseType, Entity } from "churaverse-engine-client"

/**
 * ちゅられん用の当たり判定によるダメージのインターフェース
 * @param collisionName 当たり判定の名前
 * @param collisionEntity 当たり判定のエンティティ
 */
export interface IChurarenCollidable {
  collisionName: DamageCauseType
  collisionEntity: Entity
}
