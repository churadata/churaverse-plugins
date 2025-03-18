import { BasePlugin, IMainScene } from 'churaverse-engine-server'
import { GameAbortEvent } from '@churaverse/game-plugin-server/event/gameAbortEvent'
import { GameEndEvent } from '@churaverse/game-plugin-server/event/gameEndEvent'
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

  protected subscribeGameEvent(): void {
    this.bus.subscribeEvent('gameEnd', this.gameEnd)
    this.bus.subscribeEvent('gameAbort', this.gameAbort)
  }

  protected unsubscribeGameEvent(): void {
    this.bus.unsubscribeEvent('gameEnd', this.gameEnd)
    this.bus.unsubscribeEvent('gameAbort', this.gameAbort)
  }

  private gameStart(ev: GameStartEvent): void {
    this.gameId = ev.gameId
    this.gamePluginStore = this.store.of('gamePlugin')
    this.churarenGamePluginStore = this.gamePluginStore.games.get(this.gameId)
    this.handleGameStart()
  }

  private readonly gameEnd = (ev: GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.handleGameTermination()
  }

  private readonly gameAbort = (ev: GameAbortEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.handleGameTermination()
  }

  protected abstract handleGameStart(): void

  protected abstract handleGameTermination(): void
}
