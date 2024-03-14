import { CollidableEntityRepository } from '../../collisionDetectionPlugin/domain/collisionDetection/collidableEntityRepository'
import { Shark } from './shark'

export type ISharkRepository = CollidableEntityRepository<Shark>
