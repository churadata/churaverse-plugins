import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { GameStartEvent } from '@churaverse/game-plugin-client/event/gameStartEvent'
import { GameIds } from '@churaverse/game-plugin-client/interface/gameIds'
import { GameEndEvent } from '@churaverse/game-plugin-client/event/gameEndEvent'
import { GameAbortEvent } from '@churaverse/game-plugin-client/event/gameAbortEvent'

export abstract class ChurarenEngine extends BasePlugin<IMainScene> {
  public gameId!: GameIds
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
