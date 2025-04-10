import { ChurarenEnemyDamageCause } from '@churaverse/churaren-core-plugin-client'
import { Entity } from 'churaverse-engine-client'

export class CollisionBossDamageCause extends ChurarenEnemyDamageCause {
  public constructor(public readonly entity: Entity) {
    super('boss', entity)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    boss: CollisionBossDamageCause
  }
}
