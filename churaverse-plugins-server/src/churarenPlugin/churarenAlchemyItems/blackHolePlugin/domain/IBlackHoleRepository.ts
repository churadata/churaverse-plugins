import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { BlackHole } from './blackHole'

export interface IBlackHoleRepository extends CollidableEntityRepository<BlackHole> {
  clear: () => void
}
