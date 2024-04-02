import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin/domain/collisionDetection/collidableEntityRepository'
import { Bomb } from './bomb'

export type IBombRepository = CollidableEntityRepository<Bomb>
