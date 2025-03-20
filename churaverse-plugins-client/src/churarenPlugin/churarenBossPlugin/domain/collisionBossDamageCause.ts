import { IChurarenCollidable } from '@churaverse/churaren-engine-client'
import { DamageCause, DamageCauseType, Entity } from 'churaverse-engine-client'


export class CollisionBossDamageCause extends DamageCause implements IChurarenCollidable {
  private readonly collisionBoss: DamageCauseType
  private readonly bossEntity: Entity
  public constructor(
    public readonly collisionName: DamageCauseType,
    public readonly collisionEntity: Entity
  ) {
    super('collisionBoss')
    this.collisionBoss = collisionName
    this.bossEntity = collisionEntity
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    collisionBoss: CollisionBossDamageCause
  }
}
