import { BossAttack } from './bossAttack'
import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'

export interface IBossAttackRepository extends CollidableEntityRepository<BossAttack> {
  clear: () => void
}
