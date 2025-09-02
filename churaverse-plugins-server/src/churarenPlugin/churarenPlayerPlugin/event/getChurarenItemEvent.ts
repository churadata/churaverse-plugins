import { Item } from '@churaverse/churaren-item-plugin-server/domain/item'
import { CVEvent, IMainScene } from 'churaverse-engine-server'

/**
 * アイテムを入手したら発火するイベント
 */
export class GetChurarenItemEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly item: Item
  ) {
    super('getChurarenItem', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    getChurarenItem: GetChurarenItemEvent
  }
}
