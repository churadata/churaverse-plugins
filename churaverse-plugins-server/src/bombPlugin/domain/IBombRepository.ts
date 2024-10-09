import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { Bomb } from './bomb'

export type IBombRepository = CollidableEntityRepository<Bomb>
