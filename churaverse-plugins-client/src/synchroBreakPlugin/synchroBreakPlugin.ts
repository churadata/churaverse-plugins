import { IMainScene, Store, IEventBus } from 'churaverse-engine-client'
import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'

export class SynchroBreakPlugin extends BaseGamePlugin {
  public constructor(
    store: Store<IMainScene>,
    bus: IEventBus<IMainScene>,
    sceneName: IMainScene['sceneName'],
    participateIds: string[],
    isMidwayParticipate: boolean
  ) {
    super(store, bus, sceneName, 'synchroBreak', 'シンクロブレイク', participateIds, isMidwayParticipate)
  }

  public listenEvent(): void {}
}

declare module '@churaverse/game-plugin-client/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
