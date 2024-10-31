import { IMainScene, Store, IEventBus } from 'churaverse-engine-client'
import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'
import { ToggleGameStateEvent } from '@churaverse/game-plugin-client/event/toggleGameStateEvent'
import { initSynchroBreakPluginStore } from './store/initSynchroBreakPluginStore'

export class SynchroBreakPlugin extends BaseGamePlugin {
  public constructor(
    store: Store<IMainScene>,
    bus: IEventBus<IMainScene>,
    sceneName: IMainScene['sceneName'],
    participateIds: string[],
    isMidwayParticipate: boolean
  ) {
    super(store, bus, sceneName, 'synchroBreak', 'シンクロブレイク', participateIds, isMidwayParticipate)

    console.log('initial SynchroBreakPlugin')
  }

  public listenEvent(): void {
    this.bus.subscribeEvent('toggleGameState', this.toggle.bind(this))
  }

  private init(): void {
    initSynchroBreakPluginStore(this.store)
  }

  private toggle(ev: ToggleGameStateEvent): void {
    console.log('synchroBreak toggle')
    console.log(ev)
  }
}

declare module '@churaverse/game-plugin-client/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
