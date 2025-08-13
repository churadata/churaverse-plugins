import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { IBossRepository } from '../domain/IBossRepository'
import { Boss } from '../domain/boss'

export class BossRepository extends CollidableEntityRepository<Boss> implements IBossRepository {
  private readonly bosses = new Map<string, Boss>()

  public set(id: string, entity: Boss): void {
    super.set(id, entity)
    this.bosses.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.bosses.delete(id)
  }

  public get(id: string): Boss | undefined {
    return this.bosses.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.bosses.keys())
  }

  public clear(): void {
    this.getAllId().forEach((id) => {
      super.delete(id)
    })
    this.bosses.clear()
  }
}
