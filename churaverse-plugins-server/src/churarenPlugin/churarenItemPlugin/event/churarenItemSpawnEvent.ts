import { CVEvent, IMainScene } from 'churaverse-engine-server'
import { Item } from '../domain/item'

export class ChurarenItemSpawnEvent extends CVEvent<IMainScene> {
  public constructor(public readonly items: Item[]) {
    super('churarenItemSpawn', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    churarenItemSpawn: ChurarenItemSpawnEvent
  }
}
