import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { AlchemyPot } from './alchemyPot'

export interface IAlchemyPotRepository extends CollidableEntityRepository<AlchemyPot> {
  clear: () => void
}
