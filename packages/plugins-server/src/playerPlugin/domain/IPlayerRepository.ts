import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { Player } from './player'

export type IPlayerRepository = CollidableEntityRepository<Player>
