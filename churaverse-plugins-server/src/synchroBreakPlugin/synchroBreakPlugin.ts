import { IMainScene, Store, IEventBus } from 'churaverse-engine-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'

export class SynchroBreakPlugin extends BaseGamePlugin {
  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>, participateIds: string[]) {
    super(store, bus, 'synchroBreak', participateIds)
  }

  public listenEvent(): void {}
}

declare module '@churaverse/game-plugin-server/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
