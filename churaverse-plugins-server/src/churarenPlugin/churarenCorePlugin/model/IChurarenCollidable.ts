import { DamageCauseType } from 'churaverse-engine-server'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'

/**
 * ちゅられん用の当たり判定によるダメージのインターフェース
 * @param collisionName 当たり判定の名前
 * @param collisionEntity 当たり判定のエンティティ
 */
export interface IChurarenCollidable {
  collisionName: DamageCauseType
  collisionEntity: ICollidableEntity
}
