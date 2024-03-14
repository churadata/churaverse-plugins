import { CollidableEntityRepository } from '../../collisionDetectionPlugin/domain/collisionDetection/collidableEntityRepository'
import { Bomb } from './bomb'

export type IBombRepository = CollidableEntityRepository<Bomb>
