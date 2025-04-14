import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { Boss } from './boss'

export interface IBossRepository extends CollidableEntityRepository<Boss> {
  clear: () => void
}
