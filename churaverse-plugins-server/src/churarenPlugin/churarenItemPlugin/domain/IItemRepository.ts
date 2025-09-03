import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { Item } from './item'

export interface IItemRepository extends CollidableEntityRepository<Item> {
  clear: () => void
}
