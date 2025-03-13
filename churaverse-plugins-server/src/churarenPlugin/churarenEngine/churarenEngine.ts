import { BasePlugin, IMainScene } from 'churaverse-engine-server'
import { GameStartEvent } from '@churaverse/game-plugin-server/event/gameStartEvent'
import { GameIds } from '@churaverse/game-plugin-server/interface/gameIds'
import { GamePluginStore } from '@churaverse/game-plugin-server/store/defGamePluginStore'
import { IGameInfo } from '@churaverse/game-plugin-server/interface/IGameInfo'

export abstract class ChurarenEngine extends BasePlugin<IMainScene> {
  public gameId!: GameIds
  private gamePluginStore!: GamePluginStore
  public churarenGamePluginStore!: IGameInfo | undefined

  public listenEvent(): void {
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this))
  }

  private gameStart(ev: GameStartEvent): void {
    this.gameId = ev.gameId
    this.gamePluginStore = this.store.of('gamePlugin')
    this.churarenGamePluginStore = this.gamePluginStore.games.get(this.gameId)
    this.handleGameStart()
  }

  protected abstract handleGameStart(): void

  protected abstract handleGameTermination(): void
}
